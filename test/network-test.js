const fs = require('fs');
const toml = require('toml');
const config = toml.parse(fs.readFileSync('.\\test\\test-data\\config.toml', 'utf-8'));
const assert = require('assert');
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(config.url));
const contracts = require("./test-data/" + config.network + "-contracts.js");
const testData = require("./test-data/blocks.js");
const PoaNetworkConsensusContract = new web3.eth.Contract(contracts.PoaNetworkConsensusAbi, contracts.PoaNetworkConsensusAddress);
const utils = require('web3-utils');
const BN = require('bn.js');
let validatorsArr = PoaNetworkConsensusContract.methods.getValidators();
console.log('Validators: ' + validatorsArr + ', validatorsArr.length: ' + validatorsArr.length);

/*
 * Gets the latest round and checks if any validator misses the round
 */
describe('Network health check', function () {
    describe('#Check if any validator nodes are missing rounds', function () {
        let blocksToTest = getBlocksFromLatestRound(validatorsArr.length);
        let result = checkRoundInBlocks(blocksToTest, validatorsArr);
        console.log('Rounds result validators: ' + result.missedValidators + ', passed: ' + result.passed);
        it('Validators must not miss rounds', function () {
            assert.ok(result.passed && (result.missedValidators === undefined || result.missedValidators.length === 0),
                "Validators miss the round!");
        });
    });
});

/*
Tests the checkRoundInBlocks function with custom blocks where some validators are missed.
 */
describe('Test for test', function () {
    describe('#Check if any validator nodes are missing rounds', function () {
        let result = checkRoundInBlocks(testData.blocks, testData.validators);
        console.log('result validators: ' + result.missedValidators + ', passed: ' + result.passed);
        it('Must find validators who miss rounds', function () {
            assert.ok(!result.passed && (JSON.stringify(result.missedValidators) === JSON.stringify(
                testData.missingValidators)), "Test doesn't find missing validators!");
        });
    });
});

/*
Sends transaction, checks it was confirmed and balance changed properly
//TODO: check mining
 */
describe('Network health check', function () {
    describe('#Periodically send a series of txs to check that all validator nodes are able to mine non-empty blocks', function () {
        it('Send transaction', async function () {
            this.timeout(config.timeout);
            let amountBN = new BN(config.amountToSend);
            web3.eth.personal.unlockAccount(config.accountFromAddress, config.accountFromPassword);
            let initialBalance = await web3.eth.getBalance("0xbeaa34084ab851d545e69fe54bb251832424dfcb");
            console.log("Balance before transaction: " + initialBalance);
            const receipt = await sendTransaction({
                to: config.accountToAddress,
                value: config.amountToSend,
                from: config.accountFromAddress,
                gasPrice: config.gasPrice
            });
            const finalBalance = await web3.eth.getBalance(config.accountFromAddress);
            console.log("Balance after transaction: " + finalBalance);
            console.log("transactionHash: " + receipt.transactionHash);
            assert.ok(receipt.transactionHash !== undefined && receipt.transactionHash.length > 0, "Didn't get a transaction hash");
            const transactionPrice = new BN(config.simpleTransactionCost);
            // Account balance will be reduced by sent amount plus transaction cost
            const amountExpected = amountBN.add(transactionPrice);
            let amountActual = new BN(initialBalance).sub(new BN(finalBalance));
            console.log("amountActual: " + amountActual + ", amountExpected: " + amountExpected);
            assert.ok(amountActual.eq(amountExpected), "Balance after transaction does't match");
        });
        it('Validator node should mine block with created transaction', function () {
            //TODO: check mining
        });

    });
});

/**
 * Sends transaction with specified parameters.
 *
 * @returns {Promise<TransactionReceipt>} Promise - Transaction receipt will be returned after transaction confirmed.
 */
async function sendTransaction({to, value, from, gasPrice}) {
    console.log("sendMoney");
    return await web3.eth.sendTransaction({
        to,
        value,
        from,
        gasPrice: utils.toHex(gasPrice)
    });
}

/**
 * Creates set from array of validators.
 *
 * @param validators - array of validators
 * @returns {Set} Set of validators
 */
function getValidatorsSet(validators) {
    let validatorsSet = new Set();
    for (let i = 0; i < validators.length; i++) {
        validatorsSet.add(validators[i]);
    }
    return validatorsSet;
}

/**
 * Returns the array of latest blocks. Array length will be equal to the number of validators to fit the round.
 *
 * @param numberOfValidators
 * @returns {Array}
 */
function getBlocksFromLatestRound(numberOfValidators) {
    let lastNum = web3.eth.getBlock('latest').number;
    let firstNum = lastNum - numberOfValidators + 1;
    let blocks = [];
    for (let i = 0; i < numberOfValidators; i++) {
        blocks[i] = web3.eth.getBlock(firstNum + i);
    }
    return blocks;
}

/**
 * Checks if no validator missed a round starting from 0th block in the array of blocks.
 * Checks just first round so to check more rounds it's need to call this function multiple times with different blocks.
 * The number of blocks in the round is the same as number of validators so blocks length must not be less then number of validators.
 *
 * @param blocks - array of blocks
 * @param validatorsArr
 * @returns {{passed: boolean, missedValidators: Array}}
 * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
 */
function checkRoundInBlocks(blocks, validatorsArr) {
    if (validatorsArr.length > blocks.length) {
        throw ('Blocks length must not be less then number of validators');
    }
    let validatorsSet = getValidatorsSet(validatorsArr);
    //for storing validators who mined block
    let miningMap = {};
    let result = {passed: true, missedValidators: []};
    for (let i = 0; i < validatorsArr.length; i++) {
        let block = blocks[i];
        console.log('i: ' + i + ", block.number: " + block.number + ', miner: ' + block.miner);
        if (!validatorsSet.has(block.miner)) {
            throw ("Validator doesn't exist!");
        }
        if (miningMap[block.miner]) {
            console.log('duplicate: ' + block.number + 'miner: ' + block.miner);
            miningMap[block.miner] += 1;
            result.passed = false;
        }
        else {
            console.log('add miner: ' + block.miner);
            miningMap[block.miner] = 1;
        }
    }
    if (!result.passed) {
        for (let i = 0; i < validatorsArr.length; i++) {
            if (!miningMap[validatorsArr[i]]) {
                result.missedValidators.push(validatorsArr[i]);
                console.log('missed validator: ' + validatorsArr[i]);
            }
        }
    }
    return result;
}


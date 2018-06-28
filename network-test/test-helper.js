const {
    config,
    getNetworkName,
    keyStore
} = require('../common/config.js');
const Web3 = require("web3");
let web3 = getWeb3();
const contracts = require("./contracts/" + getNetworkName() + "-contracts.js");
const testData = require("./test-data/blocks.js");
const utils = require('web3-utils');
const BN = require('bn.js');

function getWeb3(isWebsocket) {
    let url = "";
    if (process.argv.length > 3) {
        url = process.argv[3];
        console.log("got url: " + url);
    }
    else {
        console.log("process.argv.length: " + process.argv.length);
        url = config.url;
    }
    console.log("getWeb3, url: " + url);
    if (isWebsocket) {
        return new Web3(new Web3.providers.WebsocketProvider(url));
    }
    return new Web3(new Web3.providers.HttpProvider(url));
}

function getDecryptedAccount() {
    const decryptedAccount = web3.eth.accounts.decrypt(JSON.parse(keyStore), config["passwordFromPublicRpcTest_" + getNetworkName()]);
    console.log('decryptedAccount.address: ' + decryptedAccount.address);
    return decryptedAccount;
}

let testHelper = {
    /**
     * Obtains validators from the PoaNetworkConsensus contract
     * @returns {Promise.<*>}
     */
    getValidators: async function (web3) {
        // todo check if not empty
        const PoaNetworkConsensusContract = new web3.eth.Contract(contracts.PoaNetworkConsensusAbi, contracts.PoaNetworkConsensusAddress);
        let validatorsArr = await
            PoaNetworkConsensusContract.methods.getValidators().call();
        console.log('getValidators() ');
        return validatorsArr;
    },

    checkTxReceipt: async function (web3, receipt, initialBalanceFrom, initialBalanceTo) {
        // todo check tx result (status)
        let result = {passed: true, blockNumber: "", miner: "", transactionHash: "", errorMessage: ""};
        let tx = await web3.eth.getTransaction(receipt.transactionHash);
        let amountBN = new BN(config.amountToSend);
        const finalBalanceFrom = await web3.eth.getBalance(tx.from, receipt.blockNumber);
        const finalBalanceFromNow = await web3.eth.getBalance(tx.from);
        console.log("initialBalanceFrom: " + initialBalanceFrom + ", finalBalanceFrom: " + finalBalanceFrom + ", finalBalanceFromNow: " + finalBalanceFromNow);
        const finalBalanceTo = await web3.eth.getBalance(tx.to);
        console.log("transactionHash: " + receipt.transactionHash);
        result.transactionHash = receipt.transactionHash;
        if (receipt.transactionHash === undefined || receipt.transactionHash.length === 0) {
            result.passed = false;
            result.errorMessage = "Didn't get a transaction hash";
        }
        const transactionPrice = new BN(config.simpleTransactionCost);
        //Check sender
        // Account balance will be reduced by sent amount and transaction cost
        const amountExpected = amountBN.add(transactionPrice);
        const amountActual = new BN(initialBalanceFrom).sub(new BN(finalBalanceFrom));
        if (!amountActual.eq(amountExpected)) {
            result.passed = false;
            result.errorMessage = "Sender's balance after transaction does't match, expected reduce: " + amountExpected + ", actual: " + amountActual + "; ";
        }
        //Check receiver
        const amountReceived = new BN(finalBalanceTo).sub(new BN(initialBalanceTo));
        if (!amountReceived.eq(amountBN)) {
            result.passed = false;
            result.errorMessage += "Receiver's balance after transaction does't match, expected receiving: " + amountBN + ", actual: " + amountReceived;
        }
        const block = await web3.eth.getBlock(receipt.blockNumber);
        console.log("miner: " + block.miner + ", blockNumber: " + receipt.blockNumber);
        result.blockNumber = receipt.blockNumber;
        let validatorsArr = await testHelper.getValidators(web3);
        result.miner = block.miner;
        if (!(await this.validatorExists(block.miner, validatorsArr))) {
            result.passed = false;
            result.errorMessage += "Validator " + block.miner + " doesn't exist";
            console.log("validator " + block.miner + " doesn't exist");
        }
        return result;
    },

    /**
     * Checks if certain validator is returned as valid validator from the PoaNetworkConsensus contract
     * @param validator
     * @returns {Promise.<boolean>}
     */
    validatorExists: async function (validator, validatorsArr) {
        for (let i = 0; i < validatorsArr.length; i++) {
            if (validator === validatorsArr[i]) {
                return true;
            }
        }
        return false;
    },

    /**
     * Checks if no validator missed a round starting from 0th block in the array of blocks.
     *
     * @param blocks - array of blocks (or objects with fields number and miner)
     * @param validatorsArr
     * @returns {{passed: boolean, missedValidators: Array}}
     * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
     */
    checkForMissedValidators: function (blocks, validatorsArr) {
        let result = {passed: true, missedValidators: []};
        let previousBlock = -1;
        let previousValidatorIndex = -1;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            console.log("number: " + block.number);
            console.log("miner: " + block.miner);
            if (previousBlock === -1) {
                previousBlock = block.number;
                previousValidatorIndex = validatorsArr.indexOf(block.miner);
                console.log("make previousValidatorIndex: " + previousValidatorIndex);
                continue;
            }
            let blocksPassed = block.number - previousBlock;
            console.log("blocksPassed: " + blocksPassed);
            let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsArr.length;
            console.log("!expValInd: " + expectedValidatorIndex);
            let expectedValidator = validatorsArr[expectedValidatorIndex];
            let isPassed = expectedValidator === block.miner;
            console.log("expectedValidator: " + expectedValidator + ", actual: " + block.miner + ", passed: " + isPassed);
            previousValidatorIndex += blocksPassed;
            previousBlock = block.number;
            if (!isPassed) {
                result.passed = isPassed;
                result.missedValidators.push(expectedValidator);
                //validator missed the round, so next one mined
                previousValidatorIndex += 1;
            }
        }
        return result;
    }
};

module.exports = {
    config,
    testData,
    utils,
    BN,
    testHelper,
    getNetworkName,
    getWeb3,
    getDecryptedAccount
};


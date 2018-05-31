const {
    config,
    web3,
    utils,
    BN,
    testHelper
} = require('./test-helper.js');
const {sqlDao} = require('../common/dao.js');

sqlDao.createTxsTable();

let validatorsMinedTx = {};
//for saving validators who mined blocks with txs
let validatorsMinedTxSet = new Set();

checkSeriesOfTransactions(3)
    .then(result => {
        console.log("Checked ");
    })
    .catch(err => {
        console.log("Error in checkSeriesOfTransactions: " + err);
    });

//periodically send a series of txs to check that all validator nodes are able to mine non-empty blocks
async function checkSeriesOfTransactions(maxRounds) {
   //will be saved as test result
    let failedTxs = [];
    let validatorsMissedTxs = [];
    let passed = true;
    const validatorsArr = await testHelper.getValidators();
    console.log('got validators, validatorsArr.length: ' + validatorsArr.length + ", validatorsArr: " + validatorsArr);
    for (let round = 0; round < maxRounds; round++) {
        console.log("checkSeriesOfTransactions round: " + round);
        for (let i = 0; i < validatorsArr.length; i++) {
            console.log("i: " + i);
            let transactionResult = await checkMining(validatorsArr);
            if (!transactionResult.passed) {
                passed = false;
                console.log("Transaction failed, error: " + transactionResult.errorMessage);
                failedTxs.push(transactionResult);
            }
        }
        console.log("validatorsSet size: " + validatorsMinedTxSet.size);
        console.log("validatorsMinedTx: " + JSON.stringify(validatorsMinedTx));
        if (validatorsMinedTxSet.size === validatorsArr.length) {
            //all validators mined blocks with txs so no need to continue test
            break;
        }
    }
    if (validatorsMinedTxSet.size !== validatorsArr.length) {
        passed = false;
        for (let i = 0; i < validatorsArr.length; i++) {
            if (!validatorsMinedTxSet.has(validatorsArr[i])) {
                validatorsMissedTxs.push(validatorsArr[i]);
            }
        }
    }
    sqlDao.addToTxsTable([new Date(Date.now()).toLocaleString(), (passed) ? 1 : 0, JSON.stringify(validatorsMissedTxs), JSON.stringify(failedTxs)]);
    console.log('passed: ' + passed + ', JSON.stringify(validatorsMissedTxs): '
        + JSON.stringify(validatorsMissedTxs) + ', JSON.stringify(failedTxs): ' + JSON.stringify(failedTxs));
    //TODO save number of mined non-empty blocks for every validator
}

/**
 * Creates set from array of validators.
 *
 * @param validators - array of validators
 * @returns {Set} Set of validators
 */
function getValidatorsSet(validators) {
    console.log("getValidatorsSet()");
    let validatorsSet = new Set();
    for (let i = 0; i < validators.length; i++) {
        validatorsSet.add(validators[i]);
    }
    return validatorsSet;
}

/*
Sends transaction, checks it was confirmed and balance changed properly
 */
async function checkMining(validatorsArr) {
    console.log("checkMining() ");
    let result = {passed: true, number: "", miner: "", transactionHash: "", errorMessage: ""};
    let amountBN = new BN(config.amountToSend);
    await web3.eth.personal.unlockAccount(config.accountFromAddress, config.accountFromPassword);
    let initialBalanceFrom = await web3.eth.getBalance(config.accountFromAddress);
    let initialBalanceTo = await web3.eth.getBalance(config.accountToAddress);
    const receipt = await sendTransaction({
        to: config.accountToAddress,
        value: config.amountToSend,
        from: config.accountFromAddress,
        gasPrice: config.gasPrice
    });
    const finalBalanceFrom = await web3.eth.getBalance(config.accountFromAddress);
    const finalBalanceTo = await web3.eth.getBalance(config.accountToAddress);
    console.log("transactionHash: " + receipt.transactionHash);
    result.transactionHash = receipt.transactionHash;
    if (receipt.transactionHash === undefined || receipt.transactionHash.length === 0) {
        result.passed = false;
        result.errorMessage = "Didn't get a transaction hash";
        return result;
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
    result.number = receipt.blockNumber;
    console.log("validatorExists: " + await validatorExists(block.miner, validatorsArr));
    result.miner = block.miner;
    if (!validatorsMinedTxSet.has(result.miner)) {
        validatorsMinedTxSet.add(result.miner);
    }
    if (validatorsMinedTx[result.miner]) {
        validatorsMinedTx[result.miner] += 1;
    } else {
        validatorsMinedTx[result.miner] = 1;
    }
    if (!(await validatorExists(block.miner, validatorsArr))) {
        result.passed = false;
        result.errorMessage = "Validator " + block.miner + " doesn't exist";
    }
    return result;
}

/**
 * Checks if certain validator is returned as valid validator from the PoaNetworkConsensus contract
 * @param validator
 * @returns {Promise.<boolean>}
 */
async function validatorExists(validator, validatorsArr) {
    for (let i = 0; i < validatorsArr.length; i++) {
        if (validator === validatorsArr[i]) {
            return true;
        }
    }
    return false;
}

/**
 * Sends transaction with specified parameters.
 *
 * @returns {Promise<TransactionReceipt>} Promise - Transaction receipt will be returned after transaction confirmed.
 */
async function sendTransaction({to, value, from, gasPrice}) {
    console.log("sendTransaction");
    return await web3.eth.sendTransaction({
        to,
        value,
        from,
        gasPrice: utils.toHex(gasPrice)
    });
}
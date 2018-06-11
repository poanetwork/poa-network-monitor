const {
    config,
    getWeb3,
    utils,
    testHelper,
    getNetworkName
} = require('./test-helper.js');
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());
sqlDao.createTxsTable();
const web3 = getWeb3();
let validatorsMinedTx = {};
//for saving validators who mined blocks with txs
let validatorsMinedTxSet = new Set();

checkSeriesOfTransactions(config.maxRounds)
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
    let validatorsArr;
    try {
        validatorsArr = await testHelper.getValidators(web3);
    } catch (error) {
        console.error(error);
        return error;
    }
    console.log('got validators, validatorsArr.length: ' + validatorsArr.length + ", validatorsArr: " + validatorsArr);
    for (let round = 0; round < maxRounds; round++) {
        console.log("checkSeriesOfTransactions round: " + round);
        for (let i = 0; i < validatorsArr.length; i++) {
            console.log("i: " + i);
            let transactionResult;
            // todo from account 1 to 2 and backward
            try {
                transactionResult = await checkTxSending(validatorsArr);
            } catch (error) {
                console.error(error);
                return error;
            }
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
    sqlDao.addToTxsTable([new Date(Date.now()).toISOString(), (passed) ? 1 : 0, JSON.stringify(validatorsMissedTxs), JSON.stringify(failedTxs)]);
    console.log('passed: ' + passed + ', JSON.stringify(validatorsMissedTxs): '
        + JSON.stringify(validatorsMissedTxs) + ', JSON.stringify(failedTxs): ' + JSON.stringify(failedTxs));
    //TODO save number of mined non-empty blocks for every validator
}

/*
Sends transaction, checks it was confirmed and balance changed properly
 */
async function checkTxSending(validatorsArr) {
    console.log("checkTxSending()");
    await web3.eth.personal.unlockAccount(config.addressFromTxTest, config.passwordFromTxTest);
    console.log("config.addressFromTxTest: " + config.addressFromTxTest);
    let initialBalanceFrom = await web3.eth.getBalance(config.addressFromTxTest);
    console.log("initialBalanceFrom: " + initialBalanceFrom);
    let initialBalanceTo = await web3.eth.getBalance(config.addressToTxTest);
    let receipt;
    try {
        receipt = await sendTransaction({
            to: config.addressToTxTest,
            value: config.amountToSend,
            from: config.addressFromTxTest,
            gasPrice: config.gasPrice
        });
    } catch (error) {
        console.error("error in sendTransaction: " + error);
        return error;
    }
    await checkWhoMinedTxs(receipt);
    let txResult = await testHelper.checkTxReceipt(web3, receipt, initialBalanceFrom, initialBalanceTo);
    console.log("txResult: " + JSON.stringify(txResult));
    return txResult;
}

async function checkWhoMinedTxs(receipt) {
    console.log("checkWhoMinedTxs ");
    const block = await web3.eth.getBlock(receipt.blockNumber);
    console.log("receipt.blockNumber: " + receipt.blockNumber);
    if (!validatorsMinedTxSet.has(block.miner)) {
        validatorsMinedTxSet.add(block.miner);
    }
    if (validatorsMinedTx[block.miner]) {
        validatorsMinedTx[block.miner] += 1;
    } else {
        validatorsMinedTx[block.miner] = 1;
    }
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
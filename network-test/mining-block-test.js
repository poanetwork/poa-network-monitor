const {
    config,
    getWeb3,
    utils,
    testHelper,
    getNetworkName,
    BN
} = require('./test-helper.js');
const {SqlDao} = require('../common/dao.js');
let networkName = getNetworkName();
const sqlDao = new SqlDao(networkName);
sqlDao.createTxsTable();
const web3 = getWeb3();
let validatorsMinedTx = {};
//for saving validators who mined blocks with txs
let validatorsMinedTxSet = new Set();
let lastBlock;
let accountFromAddress;
let accountToAddress;
let accountFromPassword;

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
    await setAccounts();
    for (let round = 0; round < maxRounds; round++) {
        console.log("checkSeriesOfTransactions round: " + round);
        for (let i = 0; i < validatorsArr.length; i++) {
            console.log("i: " + i);
            let transactionResult;
            try {
                transactionResult = await checkTxSending(validatorsArr);
            } catch (error) {
                console.error(error);
                passed = false;
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
        //determine what validator node didn't mine tx
        for (let i = 0; i < validatorsArr.length; i++) {
            if (!validatorsMinedTxSet.has(validatorsArr[i])) {
                validatorsMissedTxs.push(validatorsArr[i]);
            }
        }
    }
    // todo save maxRounds
    sqlDao.addToTxsTable([new Date(Date.now()).toISOString(), (passed) ? 1 : 0, lastBlock, JSON.stringify(validatorsMissedTxs), JSON.stringify(failedTxs)]);
    console.log('passed: ' + passed + ', JSON.stringify(validatorsMissedTxs): '
        + JSON.stringify(validatorsMissedTxs) + ', JSON.stringify(failedTxs): ' + JSON.stringify(failedTxs));
    //TODO save number of mined non-empty blocks for every validator
    sqlDao.closeDb();
}

/**
 * Detects account with the greatest balance for sending txs from. It allows to prevent wallet emptying
 * @returns {Promise.<void>}
 */
async function setAccounts() {
    console.log("setAccounts()");
    let accountOneBalance = await web3.eth.getBalance(config["addressTxTest1_" + networkName]);
    let accountTwoBalance = await web3.eth.getBalance(config["addressTxTest2_" + networkName]);
    console.log("accountOneBalance: " + accountOneBalance + ", accountTwoBalance: " + accountTwoBalance);
    let accountFromNumber = new BN(accountOneBalance).gt(new BN(accountTwoBalance)) ? 1 : 2;
    let accountToNumber = accountFromNumber === 1 ? 2 : 1;
    console.log("accountFromNumber: " + accountFromNumber + ", accountToNumber: " + accountToNumber);

    accountFromAddress = config["addressTxTest" + accountFromNumber + "_" + networkName];
    accountToAddress = config["addressTxTest" + accountToNumber + "_" + networkName];
    accountFromPassword = config["passwordTxTest" + accountFromNumber + "_" + networkName];
    console.log("accountFromAddress: " + accountFromAddress + ", accountToAddress: " + accountToAddress);
}

/*
Sends transaction, checks it was confirmed and balance changed properly
 */
async function checkTxSending(validatorsArr) {
    console.log("checkTxSending()");
    await web3.eth.personal.unlockAccount(accountFromAddress, accountFromPassword);
    let initialBalanceFrom = await web3.eth.getBalance(accountFromAddress);
    console.log("initialBalanceFrom: " + initialBalanceFrom);
    let initialBalanceTo = await web3.eth.getBalance(accountToAddress);
    let receipt;
    try {
        receipt = await sendTransaction({
            to: accountToAddress,
            value: config.amountToSend,
            from: accountFromAddress,
            gasPrice: config.gasPrice
        });
    } catch (error) {
        console.error("error in sendTransaction: " + error);
        return {passed: false, blockNumber: "", miner: "", transactionHash: "", errorMessage: "" + error};
    }
    await checkWhoMinedTxs(receipt);
    let txResult = await testHelper.checkTxReceipt(web3, receipt, initialBalanceFrom, initialBalanceTo);
    console.log("txResult: " + JSON.stringify(txResult));
    return txResult;
}

/**
 * Determines validator who mined tx and saves to the validatorsMinedTxSet and validatorsMinedTx
 *
 * @param receipt
 * @returns {Promise.<void>}
 */
async function checkWhoMinedTxs(receipt) {
    lastBlock = receipt.blockNumber;
    console.log("checkWhoMinedTxs ");
    const block = await web3.eth.getBlock(lastBlock);
    console.log("receipt.blockNumber: " + lastBlock);
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
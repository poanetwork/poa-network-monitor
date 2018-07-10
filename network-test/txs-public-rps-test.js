const {
    config,
    utils,
    BN,
    testHelper,
    getNetworkName,
    getWeb3,
    getDecryptedAccount
} = require('./test-helper.js');
const {SqlDao} = require('../common/dao.js');
let sqlDao;
const EthereumTx = require('ethereumjs-tx');
let web3 = getWeb3();
let networkName = getNetworkName();
let accountFromPath;
let accountFromAddress;
let accountFromPassword;
let accountToAddress;

sendTxsViaPublicRpc(config.txsNumber)
    .then(result => {
        console.log("sendTxsViaPublicRpc done ");
    })
    .catch(err => {
        console.log("Error in sendTxsViaPublicRpc: " + err);
    });

/**
 * Detects account with the greatest balance for sending txs from. It allows to prevent wallet emptying
 * @returns {Promise.<void>}
 */
async function setAccounts() {
    let accountOneBalance = await web3.eth.getBalance(config["addressPublicRpcTest1_" + networkName]);
    let accountTwoBalance = await web3.eth.getBalance(config["addressPublicRpcTest2_" + networkName]);
    console.log("accountOneBalance: " + accountOneBalance + ", accountTwoBalance: " + accountTwoBalance);
    let accountFromNumber = new BN(accountOneBalance).gt(new BN(accountTwoBalance)) ? 1 : 2;
    let accountToNumber = accountFromNumber === 1 ? 2 : 1;
    console.log("accountFromNumber: " + accountFromNumber + ", accountToNumber: " + accountToNumber);

    accountFromPath = config["keyStorePath" + accountFromNumber + "_" + networkName];
    accountFromAddress = config["addressPublicRpcTest" + accountFromNumber + "_" + networkName];
    accountFromPassword = config["passwordPublicRpcTest" + accountFromNumber + "_" + networkName];
    accountToAddress = config["addressPublicRpcTest" + accountToNumber + "_" + networkName];
    console.log("accountFromAddress: " + accountFromAddress + ", accountToAddress: " + accountToAddress + ", accountFromPath: " + accountFromPath);
}

// periodically send txs via public rpc endpoint
async function sendTxsViaPublicRpc(txsNumber) {
    sqlDao = new SqlDao(networkName);
    sqlDao.createTxsPublicRpcTable();
    await setAccounts();
    let decryptedAccount = getDecryptedAccount(accountFromPath, accountFromPassword);
    for (let i = 0; i < txsNumber; i++) {
        let initialBalanceFrom = await web3.eth.getBalance(decryptedAccount.address);
        let initialBalanceTo = await web3.eth.getBalance(accountToAddress);
        let txReceipt = await sendRawTx(decryptedAccount, accountToAddress, config.amountToSend, config.simpleTransactionGas, config.gasPrice);
        let transactionResult;
        try {
            transactionResult = await testHelper.checkTxReceipt(web3, txReceipt, initialBalanceFrom, initialBalanceTo);
        } catch (error) {
            console.error(error);
            return error;
        }
        console.log("transactionResult: " + JSON.stringify(transactionResult));
        sqlDao.addToTxsPublicRpcTable([new Date(Date.now()).toISOString(), (transactionResult.passed) ? 1 : 0,
            transactionResult.errorMessage, transactionResult.transactionHash, transactionResult.blockNumber, transactionResult.miner]);
    }
    sqlDao.closeDb();
}

async function sendRawTx(decryptedAccount, to, value, gas, gasPrice) {
    const privateKeyHex = Buffer.from(decryptedAccount.privateKey.replace('0x', ''), 'hex');
    const nonce = await web3.eth.getTransactionCount(decryptedAccount.address);
    console.log("nonce: " + nonce);
    let rawTransaction = {
        "from": decryptedAccount.address,
        "to": to,
        "value": utils.toHex(value),
        "gas": utils.toHex(gas),
        "gasPrice": utils.toHex(gasPrice),
        "nonce": nonce
    };
    console.log("rawTransaction: ", JSON.stringify(rawTransaction));

    let tx = new EthereumTx(rawTransaction);
    tx.sign(privateKeyHex);
    let serializedTx = '0x' + tx.serialize().toString('hex');
    return await web3.eth.sendSignedTransaction(serializedTx);
}

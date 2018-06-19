const {
    config,
    utils,
    BN,
    testHelper,
    getDecryptedAccount
} = require('./test-helper.js');
const {SqlDao} = require('../common/dao.js');
let sqlDao;
const Web3 = require("web3");
let web3;
const EthereumTx = require('ethereumjs-tx');

//todo for core
sendTxsViaPublicRpc("sokol", "https://sokol.poa.network", config.txsNumber)
    .then(result => {
        console.log("sendTxsViaPublicRpc done ");
    })
    .catch(err => {
        console.log("Error in sendTxsViaPublicRpc: " + err);
    });

// periodically send txs via public rpc endpoint
async function sendTxsViaPublicRpc(networkName, url, txsNumber) {
    //todo different account
    sqlDao = new SqlDao(networkName);
    sqlDao.createTxsPublicRpcTable();
    web3 = new Web3(new Web3.providers.HttpProvider(url));
    let decryptedAccount = getDecryptedAccount();
    for (let i = 0; i < txsNumber; i++) {
        let initialBalanceFrom = await web3.eth.getBalance(decryptedAccount.address);
        let initialBalanceTo = await web3.eth.getBalance(config["addressToPublicRpcTest_" + networkName]);
        let txReceipt = await sendRawTx(decryptedAccount, config["addressToPublicRpcTest_" + networkName], config.amountToSend, config.simpleTransactionGas, config.gasPrice);
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

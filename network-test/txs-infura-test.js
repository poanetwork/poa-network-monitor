const {
    config,
} = require('./test-helper.js');

const {
    sendTxsViaPublicRpc
} = require('./txs-public-rpc-helper.js');

sendTxsViaPublicRpc(config.txsNumber, true)
    .then(result => {
        console.log("txs-infura-test done ");
    })
    .catch(err => {
        console.log("Error in txs-infura-test: " + err.stack);
    });
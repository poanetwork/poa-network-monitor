const {
    web3,
} = require('../network-test/test-helper.js');

function createAccount() {
    console.log("createAccount");
    web3.eth.personal.newAccount('qwerfdsa')
        .then(console.log);
}

createAccount();


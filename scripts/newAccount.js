const {
    getWeb3,
} = require('../network-test/test-helper.js');

const web3 = getWeb3();

function createAccount() {
    console.log("createAccount");
    web3.eth.personal.newAccount('qwerfdsa')
        .then(console.log);
}

createAccount();


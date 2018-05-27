const {
    web3,
} = require('./setup.js');

function createAccount() {
    console.log("createAccount");
    web3.eth.personal.newAccount('qwerfdsa')
        .then(console.log);
}

createAccount();


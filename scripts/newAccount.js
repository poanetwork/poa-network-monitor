const {
    getWeb3,
} = require('../network-test/test-helper.js');

const web3 = getWeb3();

function createAccount() {
    console.log("createAccount");
    let cmdPassword = getPassword();
    let password = cmdPassword ? cmdPassword : 'qwerfdsaesdtgrhf';
    web3.eth.personal.newAccount(password)
        .then(console.log);
}

function getPassword() {
    if (process.argv.length > 4) {
        return process.argv[4];
    }
    return undefined;
}

createAccount();


const {
    config,
    web3,
    utils,
    BN,
    getValidators,
    db
} = require('./setup.js');

db.serialize(function () {
    // todo: for each network
    db.run(" CREATE TABLE IF NOT EXISTS missed_txs_sokol (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " transactions TEXT," +
        " missedValidators TEXT)");
});

checkSeriesOfTransactions(3)
    .then(result => {
        console.log("done: ");
    })
    .catch(err => {
        console.log("error: " + err);
    });

//periodically send a series of txs to check that all validator nodes are able to mine non-empty blocks
async function checkSeriesOfTransactions(numberOfRounds) {
    console.log("checkSeriesOfTransactions");
    const validatorsArr = await getValidators();
    console.log('got validators, validatorsArr.length: ' + validatorsArr.length + ", validatorsArr: " + validatorsArr);
    let blocksWithTransactions = [];
    let transactionsPassed = true;

    for (let i = 0; i < validatorsArr.length; i++) {
        console.log("i: " + i);
        let transactionResult = await checkMining(validatorsArr);
        blocksWithTransactions.push(transactionResult);
        if (!transactionResult.passed) {
            transactionsPassed = false;
            console.log("Transaction failed, error: " + transactionResult.errorMessage);
            break;
        }
    }
    let result = checkBlocksWithTransactions(blocksWithTransactions, validatorsArr);
    result.passed = transactionsPassed ? result.passed : false;
    db.serialize(function () {
        db.run("INSERT INTO missed_txs_sokol (time, passed, transactions, missedValidators) VALUES ( ?, ?, ?, ?)",
            [new Date(Date.now()).toLocaleString(), (result.passed) ? 1 : 0, JSON.stringify(blocksWithTransactions), JSON.stringify(result.missedValidators)]);
    });
    db.close();

    console.log('result.passed ' + result.passed);
    console.log('result.missedValidators ' + result.missedValidators);

    //TODO save number of mined non-empty blocks for every validator
}

function checkBlocksWithTransactions(blocksWithTransactions, validatorsArr) {
    let result = {passed: true, missedValidators: []};
    let previousBlock = -1;
    let previousValidatorIndex = -1;
    for (let i = 0; i < blocksWithTransactions.length; i++) {
        const transactionResult = blocksWithTransactions[i];
        console.log("blockNumber: " + transactionResult.blockNumber);
        console.log("miner: " + transactionResult.miner);
        if (previousBlock === -1) {
            previousBlock = transactionResult.blockNumber;
            previousValidatorIndex = validatorsArr.indexOf(transactionResult.miner);
            console.log("make previousValidatorIndex: " + previousValidatorIndex);
            continue;
        }
        let blocksPassed = transactionResult.blockNumber - previousBlock;
        console.log("blocksPassed: " + blocksPassed);
        let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsArr.length;
        console.log("!expValInd: " + expectedValidatorIndex);
        let expectedValidator = validatorsArr[expectedValidatorIndex];
        let isPassed = expectedValidator === transactionResult.miner;
        console.log("expectedValidator: " + expectedValidator + ", actual: " + transactionResult.miner + ", passed: " + isPassed);
        previousValidatorIndex += blocksPassed;
        previousBlock = transactionResult.blockNumber;

        if (!isPassed) {
            result.missedValidators.push(expectedValidator);
            result.passed = isPassed;
            //validator missed the round, so next one mined
            previousValidatorIndex += 1;
        }
    }
    return result;
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
    let result = {passed: true, blockNumber: "", miner: "", transactionHash: "", errorMessage: ""};
    let amountBN = new BN(config.amountToSend);
    await web3.eth.personal.unlockAccount(config.accountFromAddress, config.accountFromPassword);
    let initialBalance = await web3.eth.getBalance(config.accountFromAddress);
    const receipt = await sendTransaction({
        to: config.accountToAddress,
        value: config.amountToSend,
        from: config.accountFromAddress,
        gasPrice: config.gasPrice
    });
    const finalBalance = await web3.eth.getBalance(config.accountFromAddress);
    console.log("transactionHash: " + receipt.transactionHash);
    result.transactionHash = receipt.transactionHash;
    if (receipt.transactionHash === undefined || receipt.transactionHash.length === 0) {
        result.passed = false;
        result.errorMessage = "Didn't get a transaction hash";
        return result;
    }
    const transactionPrice = new BN(config.simpleTransactionCost);
    // Account balance will be reduced by sent amount and transaction cost
    const amountExpected = amountBN.add(transactionPrice);
    const amountActual = new BN(initialBalance).sub(new BN(finalBalance));
    if (!amountActual.eq(amountExpected)) {
        result.passed = false;
        result.errorMessage = "Balance after transaction does't match, expected reduce: " + amountExpected + ", actual: " + amountActual;
        return result;
    }
    const block = await web3.eth.getBlock(receipt.blockNumber);
    console.log("miner: " + block.miner + ", blockNumber: " + receipt.blockNumber);
    result.blockNumber = receipt.blockNumber;
    console.log("validatorExists: " + await validatorExists(block.miner, validatorsArr));
    result.miner = block.miner;
    if (!(await validatorExists(block.miner, validatorsArr))) {
        result.passed = false;
        result.errorMessage = "Validator " + block.miner + " doesn't exist";
        return result;
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
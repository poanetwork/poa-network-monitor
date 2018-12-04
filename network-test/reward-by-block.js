const {
    getNetworkName,
    getWeb3,
    contracts,
    BN,
    config,
} = require('./test-helper.js');
let web3 = getWeb3();
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());
const KeysManagerContract = new web3.eth.Contract(contracts.KeysManagerAbi, contracts.KeysManagerAddress);
let blockToCheck;
let masterOfCeremony;

checkRewardByBlock();

/**
 Checks reward for new blocks (from the last checked)
 */
async function checkRewardByBlock() {
    await sqlDao.createRewardByBlockTable();
    let lastBlock = await web3.eth.getBlock('latest');
    let latestRewardByBlockRecord = await sqlDao.getLatestRewardByBlockRecord();
    let lastCheckedBlock;
    if (latestRewardByBlockRecord.length === 0) {
        console.log("No records yet");
        lastCheckedBlock = await web3.eth.getBlock(lastBlock.number - 300);
    }
    else {
        lastCheckedBlock = await web3.eth.getBlock(latestRewardByBlockRecord[0].block);
    }
    console.log("lastBlock: " + lastBlock.number + ", lastCheckedBlock: " + lastCheckedBlock.number);

    masterOfCeremony = await KeysManagerContract.methods.masterOfCeremony().call();
    blockToCheck = lastCheckedBlock;

    while (blockToCheck.number < lastBlock.number) {
        blockToCheck = await web3.eth.getBlock(blockToCheck.number + 1);
        let validator = blockToCheck.miner;
        let result = {
            passed: true,
            block: blockToCheck.number,
            validator: validator,
            payoutKey: "",
            error: [],
        };
        console.log("-- blockToCheck: " + blockToCheck.number + ", validator: " + validator);

        let emissionResult = await checkEmissionFunds();
        let blockRewardResult = await checkPayoutKeyBalance(validator);
        let txsRewardResult = await checkMiningKeyBalance(validator);

        result.passed = !emissionResult.error && !blockRewardResult.error && !txsRewardResult.error;
        result.payoutKey = blockRewardResult.payoutKey;

        if (!result.passed) {
            if (emissionResult.error) {
                result.error.push(emissionResult.error);
            }
            if (blockRewardResult.error) {
                result.error.push(blockRewardResult.error);
            }
            if (txsRewardResult.error) {
                result.error.push(txsRewardResult.error);
            }
        }
        await sqlDao.addToRewardByBlockTable([new Date(Date.now()).toISOString(), (result.passed) ? 1 : 0,
            result.block, result.validator, result.payoutKey, JSON.stringify(result.error)]);
    }
    sqlDao.closeDb();
}


/**
 Checks block reward sent to the EmissionFunds contract
 */
async function checkEmissionFunds() {
    let result = {
        error: null,
    };
    let emissionFundsContractAddress = contracts.EmissionFundsAddress;
    console.log('checkEmissionFunds(), contract address: ' + emissionFundsContractAddress);
    let expectedEmission = new BN(config.emissionFundsAmount);
    let actualEmission;
    try {
        actualEmission = new BN(await web3.eth.getBalance(emissionFundsContractAddress, blockToCheck.number))
            .sub(new BN(await web3.eth.getBalance(emissionFundsContractAddress, blockToCheck.number - 1)));
        console.log("actualEmission: " + actualEmission.toString() + ", expectedEmission: " + expectedEmission.toString());
    } catch (e) {
        console.error("Error  ", e);
        result.error = {
            description: "Error in emission funds test: " + e.message,
            expected: "",
            actual: ""
        };
        return result;
    }
    let isEmissionRight = actualEmission.eq(expectedEmission);
    if (!isEmissionRight) {
        result.error = {
            description: "Wrong emission funds amount",
            expected: expectedEmission.toString(),
            actual: actualEmission.toString()
        };
    }
    return result;
}


/**
 Checks block reward sent to validator's payout key
 */
async function checkPayoutKeyBalance(validator) {
    console.log('checkPayoutKeyBalance(), validator: ' + validator);
    let result = {
        error: null,
        payoutKey: ""
    };
    // Master of Ceremony doesn't have payout key
    if (validator === masterOfCeremony) {
        console.log("masterOfCeremony ");
        return result;
    }
    let expectedBlockReward = new BN(config.miningReward);
    let actualBlockReward;
    let payoutKey;
    try {
        payoutKey = await KeysManagerContract.methods.getPayoutByMining(validator).call();
        result.payoutKey = payoutKey;
        actualBlockReward = new BN(await web3.eth.getBalance(payoutKey, blockToCheck.number)).sub(new BN(await web3.eth.getBalance(payoutKey, blockToCheck.number - 1)));
        console.log("actualBlockReward: " + actualBlockReward.toString() + ", expectedBlockReward: " + expectedBlockReward.toString() + ', payoutKey: ' + payoutKey);
    } catch (e) {
        console.error("Error  ", e);
        result.error = {
            description: "Error in payout key balance check: " + e.message,
            expected: "",
            actual: ""
        };
        return result;
    }
    for (let j = 0; j < blockToCheck.transactions.length; j++) {
        let tx = await web3.eth.getTransaction(blockToCheck.transactions[j]);
        let gasPrice = new BN(tx.gasPrice);
        let receipt = await web3.eth.getTransactionReceipt(blockToCheck.transactions[j]);
        let transactionPrice = new BN(receipt.gasUsed).mul(gasPrice);
        console.log("tx.from: " + tx.from + ", tx.to: " + tx.to);
        if (tx.from === payoutKey) {
            expectedBlockReward = expectedBlockReward.sub(new BN(tx.value).sub(transactionPrice));
        }
        else if (tx.to === payoutKey) {
            expectedBlockReward = expectedBlockReward.add(new BN(tx.value));
        }
    }
    let isRewardRight = actualBlockReward.eq(expectedBlockReward);
    if (!isRewardRight) {
        result.error = {
            description: "Wrong block reward (payout key)",
            expected: expectedBlockReward.toString(),
            actual: actualBlockReward.toString()
        };
    }
    return result;
}

/**
 Checks reward for block transactions sent to validator's mining key
 */
async function checkMiningKeyBalance(validator) {
    console.log('checkMiningKeyBalance(), validator: ' + validator);
    let result = {
        error: null,
    };
    let actualTxsReward;
    try {
        actualTxsReward = new BN(await web3.eth.getBalance(validator, blockToCheck.number))
            .sub(new BN(await web3.eth.getBalance(validator, blockToCheck.number - 1)));
        console.log("actualTxsReward: " + actualTxsReward);
    } catch (e) {
        console.error("checkMiningKeyBalance Error  " + e.message);
        result.error = {
            description: "Error in mining key balance check: " + e.message,
            expected: "",
            actual: ""
        };
        return result;
    }

    let expectedTxsReward = new BN(0);
    for (let j = 0; j < blockToCheck.transactions.length; j++) {
        let tx = await web3.eth.getTransaction(blockToCheck.transactions[j]);
        let gasPrice = new BN(tx.gasPrice);
        let receipt = await web3.eth.getTransactionReceipt(blockToCheck.transactions[j]);
        let transactionPrice = new BN(receipt.gasUsed).mul(gasPrice);
        console.log("tx.from: " + tx.from + ", tx.to: " + tx.to);
        if (!(tx.from === blockToCheck.miner)) {
            expectedTxsReward = expectedTxsReward.add(transactionPrice);
        }
        else if (tx.from === blockToCheck.miner) {
            expectedTxsReward = expectedTxsReward.sub(new BN(tx.value));
        }
        else if (tx.to === blockToCheck.miner) {
            expectedTxsReward = expectedTxsReward.add(new BN(tx.value));
        }
    }

    // Master of Ceremony receives block reward on the Mining key
    if (validator === masterOfCeremony) {
        console.log("masterOfCeremony, reward for txs: " + expectedTxsReward.toString());
        expectedTxsReward = expectedTxsReward.add(new BN(config.miningReward));
    }
    console.log("expectedTxsReward: " + expectedTxsReward.toString() + ", actualTxsReward: " + actualTxsReward.toString());

    let isRewardRight = actualTxsReward.eq(expectedTxsReward);
    if (!isRewardRight) {
        result.error = {
            description: "Wrong txs reward (mining key)",
            expected: expectedTxsReward.toString(),
            actual: actualTxsReward.toString()
        };
    }
    return result;
}

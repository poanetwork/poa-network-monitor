// check if payout script works properly for all nodes (check mining address balance)
const {
    config,
    getNetworkName,
    getWeb3,
    BN,
    testHelper,
} = require('./test-helper.js');
let web3 = getWeb3();
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());

sqlDao.createRewardTable();

/*
 * Gets the latest round and checks if any validator misses the round
 */
async function checkMiningReward() {
    console.log("checkMiningReward");
    const validatorsArr = await testHelper.getValidators();
    let blocksToTest = await getBlocksFromLatestRound(validatorsArr.length);
    for (let i = 0; i < blocksToTest.length; i++) {
        let result = await checkBlocksRewards(blocksToTest[i]);
        console.log("passed: " + result.passed + ", rewardDetails: " + JSON.stringify(result.rewardDetails) +
            ", transactions: " + JSON.stringify(result.transactions));
        sqlDao.addToRewardTable([new Date(Date.now()).toLocaleString(), (result.passed) ? 1 : 0, result.error,
            JSON.stringify(result.rewardDetails), JSON.stringify(result.transactions)]);
    }

}

checkMiningReward();

/**
 * Checks if miner got right reward for block creation and adding txs to the block
 *
 * @param blocks - array of blocks (or objects with fields number and miner)
 * @param validatorsArr
 * @returns {Promise.<{passed: boolean, error: string,  rewardDetails: Array}>}
 */
async function checkBlocksRewards(block) {
    // todo: save each validator's rewards
    let result = {passed: true, error: "", rewardDetails: {}, transactions: []};
    console.log("number: " + block.number + ", miner: " + block.miner);
    let actualBalanceIncrease = new BN(await web3.eth.getBalance(block.miner, block.number)).sub(new BN(await web3.eth.getBalance(block.miner, block.number - 1)));
    let expectedBalanceIncrease = new BN(config.miningReward);
    console.log("got reward: " + actualBalanceIncrease);
    console.log("config.miningReward: " + config.miningReward);
    //reward will be different if there are txs
    for (let j = 0; j < block.transactions.length; j++) {
        let details = {hash: "", price: "", value: "", to: "", from: ""};
        let tx = await web3.eth.getTransaction(block.transactions[j]);
        let gasPrice = new BN(tx.gasPrice);
        let receipt = await web3.eth.getTransactionReceipt(block.transactions[j]);
        let transactionPrice = new BN(receipt.gasUsed).mul(gasPrice);
        details.hash = receipt.transactionHash;
        details.from = tx.from;
        details.to = tx.to;
        details.gasPrice = gasPrice.toString();
        details.gasUsed = receipt.gasUsed;
        console.log("receipt.from: " + tx.from);
        console.log("receipt.to: " + tx.to);
        if (!(tx.from === block.miner)) {
            expectedBalanceIncrease = expectedBalanceIncrease.add(transactionPrice);
            details.price = transactionPrice.toString();
        }
        else if (tx.from === block.miner) {
            expectedBalanceIncrease = expectedBalanceIncrease.sub(new BN(tx.value));
            details.value = tx.value;
        }
        else if (tx.to === block.miner) {
            expectedBalanceIncrease = expectedBalanceIncrease.add(new BN(tx.value));
        }
        console.log("transaction details: " + JSON.stringify(details));
        result.transactions.push(details);
        console.log("expectedBalanceIncrease: " + expectedBalanceIncrease);
    }
    result.rewardDetails = {
        validator: block.miner,
        block: block.number,
        gasUsed: block.gasUsed,
        basicReward: config.miningReward,
        expectedReward: expectedBalanceIncrease.toString(),
        actualReward: actualBalanceIncrease.toString(),
        txsNumber: block.transactions.length,
    };
    let isRewardRight = actualBalanceIncrease.eq(expectedBalanceIncrease);
    if (!isRewardRight) {
        result.passed = false;
        result.error = "Wrong reward, \n" + "validator: " + block.miner + "\nexpected: " + expectedBalanceIncrease + "\nactual:      " + actualBalanceIncrease +
            "\nblock: " + block.number + "; \n\n";
    }
    return result;
}


/**
 * Returns the array of latest blocks. Array length will be equal to the number of validators to fit the round.
 *
 * @param numberOfValidators
 * @returns {Array}
 */
async function getBlocksFromLatestRound(numberOfValidators) {
    const lastBlock = await web3.eth.getBlock('latest');
    const firstNum = lastBlock.number - numberOfValidators + 1;
    let blocks = [];
    for (let i = 0; i < numberOfValidators; i++) {
        blocks[i] = await web3.eth.getBlock(firstNum + i);
    }
    console.log("getBlocksFromLatestRound blocks.length: " + blocks.length);
    return blocks;
}


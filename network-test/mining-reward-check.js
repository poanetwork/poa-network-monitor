// check if payout script works properly for all nodes (check mining address balance)
const {
    config,
    web3,
    BN,
    testHelper,
} = require('./test-helper.js');

const {sqlDao} = require('../common/dao.js');

sqlDao.createRewardTable();

/*
 * Gets the latest round and checks if any validator misses the round
 */
async function checkMiningReward() {
    console.log("checkMiningReward");
    const validatorsArr = await testHelper.getValidators();
    let blocksToTest = await getBlocksFromLatestRound(validatorsArr.length);
    let result = await checkBlocksRewards(blocksToTest, validatorsArr);
    console.log("passed: " + result.passed + ", wrongRewards: " + JSON.stringify(result.wrongRewards));
    sqlDao.addToRewardTable([new Date(Date.now()).toLocaleString(), (result.passed) ? 1 : 0, result.error, JSON.stringify(result.wrongRewards)]);
}

checkMiningReward();

/**
 * Checks if miner got right reward for block creation and adding txs to the block
 *
 * @param blocks - array of blocks (or objects with fields number and miner)
 * @param validatorsArr
 * @returns {Promise.<{passed: boolean, error: string,  wrongRewards: Array}>}
 */
async function checkBlocksRewards(blocks, validatorsArr) {
    // todo: save validators rewards
    let result = {passed: true, error: "", wrongRewards: []};
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        console.log("number: " + block.number + ", miner: " + block.miner);
        let actualBalanceIncrease = new BN(await web3.eth.getBalance(block.miner, block.number)).sub(new BN(await web3.eth.getBalance(block.miner, block.number - 1)));
        let expectedBalanceIncrease = new BN(config.miningReward);
        console.log("got reward: " + actualBalanceIncrease);
        console.log("config.miningReward: " + config.miningReward);
        let transactionsDetails = "";
        //reward will be different if there are txs
        if (block.transactions.length > 0) {
            transactionsDetails += "\nTransactions details\n";
            for (let j = 0; j < block.transactions.length; j++) {
                let receipt = await web3.eth.getTransactionReceipt(block.transactions[j]);
                let transactionPrice = receipt.gasUsed * await(web3.eth.getGasPrice());
                transactionsDetails += "Transaction hash: " +  receipt.transactionHash + ", \n";
                console.log("transactionPrice: " + transactionPrice);
                if (!(block.transactions[j].from === block.miner)) {
                    expectedBalanceIncrease = expectedBalanceIncrease.add(new BN(transactionPrice));
                    transactionsDetails += "Received transaction price: " + transactionPrice + ", \n";
                }
                else if (block.transactions[j].from === block.miner) {
                    expectedBalanceIncrease = expectedBalanceIncrease.sub(new BN(block.transactions[j].value));
                    transactionsDetails += "Miner sent tx, balance decrease: " + block.transactions[j].value + ", \n";
                }
                else if (block.transactions[j].to === block.miner) {
                    expectedBalanceIncrease = expectedBalanceIncrease.add(new BN(block.transactions[j].value));
                    transactionsDetails += "Miner received tx, balance increase: " + block.transactions[j].value + ", \n";
                }
            }
            console.log("rewardExpected: " + expectedBalanceIncrease);
        }
        console.log("transactionsDetails: " + transactionsDetails);
        let isRewardRight = actualBalanceIncrease.eq(expectedBalanceIncrease);
        if (!isRewardRight) {
            result.passed = false;
            result.wrongRewards.push({
                validator: block.miner,
                block: block.number,
                expectedReward: expectedBalanceIncrease,
                actualReward: actualBalanceIncrease
            });
            result.error += "Wrong reward, \n"  + "validator: " + block.miner +  "\nexpected: " + expectedBalanceIncrease + "\nactual:   " + actualBalanceIncrease +
                "\nblock: " + block.number + transactionsDetails + "; \n\n";
        }
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


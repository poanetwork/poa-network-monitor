// check if payout script works properly for all nodes (check mining address balance)
const {
    config,
    web3,
    BN,
    getValidators,
} = require('./setup.js');

const {
    createRewardTable,
    addToRewardTable,
} = require('./dao.js');

createRewardTable();

/*
 * Gets the latest round and checks if any validator misses the round
 */
async function checkMiningReward() {
    console.log("checkMiningReward");
    const validatorsArr = await getValidators();
    let blocksToTest = await getBlocksFromLatestRound(validatorsArr.length);
    let result = await checkBlocksRewards(blocksToTest, validatorsArr);
    console.log("passed: " + result.passed + ", result.missedValidators: " + result.missedValidators + ", wrongRewards: " + result.wrongRewards);
    addToRewardTable([new Date(Date.now()).toLocaleString(), (result.passed) ? 1 : 0, result.error, JSON.stringify(result.missedValidators), JSON.stringify(result.wrongRewards)]);
}

checkMiningReward();

/**
 * Checks if no validator missed a round starting from 0th block in the array of blocks.
 *
 * @param blocks - array of blocks (or objects with fields number and miner)
 * @param validatorsArr
 * @returns {{passed: boolean, missedValidators: Array}}
 * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
 */
async function checkBlocksRewards(blocks, validatorsArr) {
    // todo: save validators rewards
    let result = {passed: true, error: "", missedValidators: [], wrongRewards: []};
    let previousBlock = -1;
    let previousValidatorIndex = -1;
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        console.log("number: " + block.number);
        console.log("miner: " + block.miner);
        if (previousBlock === -1) {
            previousBlock = block.number;
            previousValidatorIndex = validatorsArr.indexOf(block.miner);
            console.log("make previousValidatorIndex: " + previousValidatorIndex);
        } else {
            let blocksPassed = block.number - previousBlock;
            console.log("blocksPassed: " + blocksPassed);
            let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsArr.length;
            console.log("!expValInd: " + expectedValidatorIndex);
            let expectedValidator = validatorsArr[expectedValidatorIndex];
            let isRightValidator = expectedValidator === block.miner;
            console.log("expectedValidator: " + expectedValidator + ", actual: " + block.miner + ", isRightValidator: " + isRightValidator);
            previousValidatorIndex += blocksPassed;
            previousBlock = block.number;
            if (!isRightValidator) {
                result.passed = false;
                result.missedValidators.push(expectedValidator);
                result.error += "validator node missed round; ";
                //validator missed the round, so next one mined
                previousValidatorIndex += 1;
            }
        }
        //todo: check if there are other txs for miner
        let reward = new BN(await web3.eth.getBalance(block.miner, block.number)).sub(new BN(await web3.eth.getBalance(block.miner, block.number - 1)));
        let rewardExpected = new BN(config.miningReward);
        console.log("reward: " + reward);
        console.log("config.miningReward: " + config.miningReward);
        let isRewardRight = reward.eq(rewardExpected);
        if (!isRewardRight) {
            result.passed = false;
            result.wrongRewards.push({
                validator: block.miner,
                block: block.number,
                expectedReward: rewardExpected,
                actualReward: reward
            });
            result.error += "wrong reward, expected: " + rewardExpected + ", actual: " + reward + ", block: " + block.number + "; ";
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


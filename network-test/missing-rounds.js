const {
    getWeb3,
    testData,
    testHelper,
    getNetworkName
} = require('./test-helper.js');
let web3 = getWeb3();
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());

sqlDao.createMissingRoundsTable();

/*
 * Gets the latest round and checks if any validator misses the round
 */
async function checkMissingValidators() {
    console.log("checkMissingValidators");
    const validatorsArr = await testHelper.getValidators(web3);
    let blocksToTest = await getBlocksFromLatestRound(validatorsArr.length);
    let result = testHelper.checkForMissedValidators(blocksToTest, validatorsArr);
    console.log("passed: " + result.passed + ", result.missedValidators" + result.missedValidators);
    sqlDao.addToMissingRounds([new Date(Date.now()).toISOString(), (result.passed) ? 1 : 0, JSON.stringify(result.missedValidators)]);
}

checkMissingValidators();

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

//testCheckRoundInBlocks();

/*
Tests the checkRoundInBlocks function with custom blocks where some validators are missed.
 */
function testCheckRoundInBlocks() {
    console.log("testCheckRoundInBlocks");
    let result = testHelper.checkForMissedValidators(testData.blocks, testData.validators);
    console.log("Found missed validators: " + (!result.passed && (JSON.stringify(result.missedValidators) === JSON.stringify(
        testData.missingValidators))));
}

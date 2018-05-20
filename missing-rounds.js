const {
    web3,
    testData,
    getValidators
} = require('./setup.js');


/*
 * Gets the latest round and checks if any validator misses the round
 */
async function checkMissingValidators() {
    const validatorsArr = await getValidators();
    let blocksToTest = await getBlocksFromLatestRound(validatorsArr.length);
    let result = checkRoundInBlocks(blocksToTest, validatorsArr);
    console.log("passed: " + result.passed + ", result.missedValidators" + result.missedValidators);
    //TODO: save result
}

checkMissingValidators();
//testCheckRoundInBlocks();

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

/**
 * Checks if no validator missed a round starting from 0th block in the array of blocks.
 * Checks just first round so to check more rounds it's need to call this function multiple times with different blocks.
 * The number of blocks in the round is the same as number of validators so blocks length must not be less then number of validators.
 *
 * @param blocks - array of blocks
 * @param validatorsArr
 * @returns {{passed: boolean, missedValidators: Array}}
 * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
 */
function checkRoundInBlocks(blocks, validatorsArr) {
    console.log('checkRoundInBlocks: blocks ' + blocks.length + ', validatorsArr: len ' + validatorsArr.length);
    if (validatorsArr.length === 0) {
        throw ('Validators array must not be empty!');
    }
    if (validatorsArr.length > blocks.length) {
        throw ('Blocks length must not be less then number of validators');
    }
    let validatorsSet = getValidatorsSet(validatorsArr);
    //for storing validators who mined block
    let miningMap = {};
    let result = {passed: true, missedValidators: []};
    for (let i = 0; i < validatorsArr.length; i++) {
        let block = blocks[i];
        if (!validatorsSet.has(block.miner)) {
            throw ("Validator doesn't exist!");
        }
        if (miningMap[block.miner]) {
            console.log('duplicate: ' + block.number + 'miner: ' + block.miner);

            miningMap[block.miner] += 1;
            result.passed = false;
        }
        else {
            console.log('add miner: ' + block.miner);
            miningMap[block.miner] = 1;
        }
    }
    if (!result.passed) {
        for (let i = 0; i < validatorsArr.length; i++) {
            if (!miningMap[validatorsArr[i]]) {
                result.missedValidators.push(validatorsArr[i]);
                console.log('missed validator: ' + validatorsArr[i]);
            }
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
    let validatorsSet = new Set();
    for (let i = 0; i < validators.length; i++) {
        validatorsSet.add(validators[i]);
    }
    return validatorsSet;
}


/*
Tests the checkRoundInBlocks function with custom blocks where some validators are missed.
 */
function testCheckRoundInBlocks() {
    console.log("testCheckRoundInBlocks");
    let result = checkRoundInBlocks(testData.blocks, testData.validators);
    console.log("Found missed validators: " + (!result.passed && (JSON.stringify(result.missedValidators) === JSON.stringify(
        testData.missingValidators))));
}

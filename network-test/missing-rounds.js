const {
    getWeb3,
    testData,
    testHelper,
    getNetworkName
} = require('./test-helper.js');
// need to use WebsocketProvider
let web3 = getWeb3(true);
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());

sqlDao.createMissingRoundsTable();
let blocksChecked = 0;
let previousValidatorIndex = -1;
let previousValidator = "";
let previousBlockNumber = -1;
let lastBlock = -1;
let startValidatorIndex = -1;
let validatorsLength = 0;
let isFirstBlock = false;
let currentValidatorIndex;

// for checking test
let validators;
let addedValidators = [];

checkComingBlocks(testHelper.getValidators);

/**
 *Checks validator of the block
 * @param blockHeader
 * @param getValidators
 * @returns {Promise.<Array>} - validators who missed their turn
 */
async function checkBlock(blockHeader, getValidators) {
    console.log("checkBlock() Got new block: " + blockHeader.number + ", validator: " + blockHeader.miner + ", previousValidatorIndex: " + previousValidatorIndex);
    const validatorsArr = await getValidators(web3);
    validatorsLength = validatorsArr.length;
    console.log("validatorsLength: " + validatorsLength);
    lastBlock = blockHeader.number;
    let blocksPassed = lastBlock - previousBlockNumber;
    console.log("blocksPassed: " + blocksPassed);
    currentValidatorIndex = validatorsArr.indexOf(blockHeader.miner);

    if (previousBlockNumber === -1
        || validatorsLength <= previousValidatorIndex  // in the begin of the test
        || validatorsArr[previousValidatorIndex] !== previousValidator  //index will be changed if previous validator was removed or replaced removed one
        || blocksPassed <= 0 // reorg
    ) {
        startValidatorIndex = currentValidatorIndex;
        isFirstBlock = true;
        console.log("begin, previousValidatorIndex: " + previousValidatorIndex);
    } else {
        isFirstBlock = false;
        // blocks can come inconsistently sometimes
        let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsLength;
        let expectedValidator = validatorsArr[expectedValidatorIndex];
        let isPassed = expectedValidator === blockHeader.miner;
        console.log("expectedValidatorIndex: " + expectedValidatorIndex + "expectedValidator: " + expectedValidator + ", actual: " + blockHeader.miner + ", passed: " + isPassed);
        if (!isPassed) {
            let missedValidators = [];
            let ind = expectedValidatorIndex;
            // more then one validator could miss round in one time
            // all validators in array from expected one till actual will be missed
            while (ind !== currentValidatorIndex) {
                console.log("ind: " + ind + "added : " + validatorsArr[ind]);
                missedValidators.push(validatorsArr[ind]);
                ind = (ind + 1) % validatorsLength;
            }
            return missedValidators;
        }
        blocksChecked++;
        console.log("blocksChecked: " + blocksChecked);
    }

    previousValidator = blockHeader.miner;
    previousBlockNumber = blockHeader.number;
    previousValidatorIndex = currentValidatorIndex;
}

/**
 * Checks coming blocks for validators missed their turn.
 *
 * @param getValidators - function for getting validators at the moment
 * @returns {Promise.<void>} {{passed: boolean, missedValidators: Array}}
 * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
 */
async function checkComingBlocks(getValidators) {
    let result = {passed: true, missedValidators: []};
    let subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
        if (error)
            console.log("subscription error: " + error);
    }).on("data", async function (blockHeader) {
        let missedFromBlock = await checkBlock(blockHeader, getValidators);
        console.log('got missedFromBlock: ' + missedFromBlock);
        if (missedFromBlock) {
            for (let v of missedFromBlock) {
                result.missedValidators.push(v);
            }
        }
        console.log("-- blocksChecked: " + blocksChecked + ", currentValidatorIndex: " + currentValidatorIndex + ", startValidatorIndex: " + startValidatorIndex);
        // round is checked, save result and exit
        // skip check for first block
        if (!isFirstBlock && (currentValidatorIndex % validatorsLength === startValidatorIndex)) {
            console.log("----result: " + JSON.stringify(result));
            subscription.unsubscribe();
            await sqlDao.addToMissingRounds([new Date(Date.now()).toISOString(), (result.passed) ? 1 : 0, lastBlock, JSON.stringify(result.missedValidators)]);
            sqlDao.closeDb();
            process.exit(0);
        }
    });
}

// Check test with custom blocks and added validators, uncomment for running
// checkMissingRoundsTest();

/**
 * Tests the checkRoundInBlocks function. Uses custom blocks where some validators are missed
 * and custom function for getting validators that sometimes adds new validators.
 * Prints result to the console
 *
 * @returns {Promise.<void>}
 */
async function checkMissingRoundsTest() {
    console.log("checkMissingRoundsTest");
    validators = testData.validators;
    let blockToTestInd = 0;
    console.log('testData.blocks.length: ' + testData.blocks.length);
    let result = {passed: true, missedValidators: []};
    while (blockToTestInd < testData.blocks.length) {
        console.log('blockToTestInd: ' + blockToTestInd + ", blocksChecked: " + blocksChecked);
        let missedFromBlock = await checkBlock(testData.blocks[blockToTestInd], randomlyAddValidator);
        console.log('got missedFromBlock: ' + missedFromBlock);
        if (missedFromBlock) {
            for (let v of missedFromBlock) {
                result.missedValidators.push(v);
            }
        }
        blockToTestInd = blockToTestInd + 1;
    }
    // check result
    console.log("result: " + JSON.stringify(result));
    console.log("final validators:");
    for (let i = 0; i < validators.length; i++) {
        console.log(i + " : " + validators[i]);
    }
    let missedValidator;
    for (missedValidator of testData.missingValidators) {
        console.log("check missedValidator: " + missedValidator);
        if (result.missedValidators.indexOf(missedValidator) === -1) {
            result.passed = false;
            console.log("didn't find missed validator: " + missedValidator);
        }
    }
    let addedValidator;
    for (addedValidator of addedValidators) {
        console.log("check addedValidator: " + addedValidator);
        if (result.missedValidators.indexOf(addedValidator) === -1) {
            result.passed = false;
            console.log("didn't find added validator who missed round: " + addedValidator);
        }
    }
    console.log("checking passed: " + result.passed);
    process.exit(0);
}

/**
 * Function for getting test validators array. Sometimes adds a new random validator to the validators array
 * @returns {*}
 */
function randomlyAddValidator() {
    // add new validators only in the begin, otherwise they will not be checked
    if ((validators.length < testData.blocks.length * 2) && (blocksChecked < testData.blocks.length / 2)
        && (Math.floor(Math.random() * 5) + 1) === 1) //will happen about once in 5 calls
    {
        let addedValidator = "0x11111111111111111111111111111111111" + generateRandomHex(5);
        console.log("addedValidator: " + addedValidator);
        validators.push(addedValidator);
        addedValidators.push(addedValidator);
    }
    return validators;
}

/**
 * Generates random hex string
 * @param len
 * @returns {string}
 */
function generateRandomHex(len) {
    let result = "";
    for (let i = 0; i < len; i++) {
        result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
}

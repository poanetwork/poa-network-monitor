const {
    getWeb3,
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

let missingRoundsCheck = {

    /**
     *Checks validator of the block
     * @param blockHeader
     * @param validatorsArr
     * @returns {Promise.<Array>} - validators who missed their turn
     */
    checkBlock: async function (blockHeader, validatorsArr) {
        console.log("--- checkBlock() Got new block: " + blockHeader.number + ", validator: " + blockHeader.miner +
            ", previousValidatorIndex: " + previousValidatorIndex + ", lastBlock: " + lastBlock);
        validatorsLength = validatorsArr.length;
        console.log("validatorsLength: " + validatorsLength);
        lastBlock = blockHeader.number;
        let blocksPassed = lastBlock - previousBlockNumber;
        console.log("blocksPassed: " + blocksPassed + ", lastBlock: " + lastBlock + ", previousBlockNumber: " + previousBlockNumber);
        currentValidatorIndex = validatorsArr.indexOf(blockHeader.miner);
        let missedValidators = [];
        if (previousBlockNumber === -1  // in the begin of the test
            || blocksPassed <= 0 // reorg
        ) {
            startValidatorIndex = currentValidatorIndex;
            isFirstBlock = true;
            console.log("begin, previousValidatorIndex: " + previousValidatorIndex);
        } else {
            isFirstBlock = false;
            let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsLength;
            let expectedValidator = validatorsArr[expectedValidatorIndex];
            let isPassed = expectedValidator === blockHeader.miner;
            console.log("expectedValidatorIndex: " + expectedValidatorIndex + "expectedValidator: " + expectedValidator + ", actual: " + blockHeader.miner + ", passed: " + isPassed);
            if (!isPassed) {
                let ind = expectedValidatorIndex;
                // more then one validator could miss round in one time
                // all validators in array from expected one till actual will be missed
                let added = 0;
                while (ind !== currentValidatorIndex && added < validatorsLength) {
                    console.log("ind: " + ind + ", added : " + validatorsArr[ind]);
                    missedValidators.push(validatorsArr[ind]);
                    ind = (ind + 1) % validatorsLength;
                    added++;
                }
            }
            console.log("blocksChecked: " + blocksChecked);
        }
        blocksChecked++;
        previousValidator = blockHeader.miner;
        previousBlockNumber = lastBlock;
        previousValidatorIndex = currentValidatorIndex;
        return missedValidators;
    },

    /**
     * Checks coming blocks for validators missed their turn.
     *
     * @param getValidators - function for getting validators at the moment
     * @returns {Promise.<void>} {{passed: boolean, missedValidators: Array}}
     * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
     */
    checkComingBlocks: async function (getValidators) {
        let result = {passed: true, missedValidators: []};
        let self = this;
        let subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
            if (error)
                console.log("subscription error: " + error);
        }).on("data", async function (blockHeader) {
            let validatorsArray = await testHelper.getValidators(web3);
            let missedFromBlock = await self.checkBlock(blockHeader, validatorsArray);
            if (missedFromBlock) {
                for (let v of missedFromBlock) {
                    if (result.missedValidators.indexOf(v) === -1) {
                        result.missedValidators.push(v);
                        result.passed = false;
                    }
                }
            }
            console.log("-- blocksChecked: " + blocksChecked + ", currentValidatorIndex: " + currentValidatorIndex + ", startValidatorIndex: " + startValidatorIndex);
            // round is checked, save result and exit
            // skip check for first block
            if (!isFirstBlock && (currentValidatorIndex === startValidatorIndex)) {
                console.log("result: " + JSON.stringify(result));
                subscription.unsubscribe();
                await sqlDao.addToMissingRounds([new Date(Date.now()).toISOString(), (result.passed) ? 1 : 0, lastBlock, JSON.stringify(result.missedValidators)]);
                sqlDao.closeDb();
                process.exit(0);
            }
        });
    }
};

missingRoundsCheck.checkComingBlocks();

module.exports = {
    missingRoundsCheck
};





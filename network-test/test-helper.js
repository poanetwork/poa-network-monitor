const {
    config,
    getNetworkName
} = require('../common/config.js');
const Web3 = require("web3");
let web3 = getWeb3();
const contracts = require("./contracts/" + getNetworkName() + "-contracts.js");
const testData = require("./test-data/blocks.js");
const PoaNetworkConsensusContract = new web3.eth.Contract(contracts.PoaNetworkConsensusAbi, contracts.PoaNetworkConsensusAddress);
const utils = require('web3-utils');
const BN = require('bn.js');

function getWeb3() {
    let url = "";
    if (process.argv.length > 3) {
        url = process.argv[3];
        console.log("got url: " + url);
    }
    else {
        console.log("process.argv.length: " + process.argv.length);
        url = config.url;
    }
    console.log("getWeb3, url: " + url);
    return new Web3(new Web3.providers.HttpProvider(url));
}

let testHelper = {
    /**
     * Obtains validators from the PoaNetworkConsensus contract
     * @returns {Promise.<*>}
     */
    getValidators: async function () {
        let validatorsArr = await
            PoaNetworkConsensusContract.methods.getValidators().call();
        console.log('getValidators() ');
        return validatorsArr;
    },

    /**
     * Checks if no validator missed a round starting from 0th block in the array of blocks.
     *
     * @param blocks - array of blocks (or objects with fields number and miner)
     * @param validatorsArr
     * @returns {{passed: boolean, missedValidators: Array}}
     * Returns object that contains boolean result (true if no validators missed the round) and array of validators that missed the round
     */
    checkForMissedValidators: function (blocks, validatorsArr) {
        let result = {passed: true, missedValidators: []};
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
                continue;
            }
            let blocksPassed = block.number - previousBlock;
            console.log("blocksPassed: " + blocksPassed);
            let expectedValidatorIndex = (previousValidatorIndex + blocksPassed) % validatorsArr.length;
            console.log("!expValInd: " + expectedValidatorIndex);
            let expectedValidator = validatorsArr[expectedValidatorIndex];
            let isPassed = expectedValidator === block.miner;
            console.log("expectedValidator: " + expectedValidator + ", actual: " + block.miner + ", passed: " + isPassed);
            previousValidatorIndex += blocksPassed;
            previousBlock = block.number;
            if (!isPassed) {
                result.passed = isPassed;
                result.missedValidators.push(expectedValidator);
                //validator missed the round, so next one mined
                previousValidatorIndex += 1;
            }
        }

        return result;
    }
};

module.exports = {
    config,
    testData,
    utils,
    BN,
    testHelper,
    getNetworkName,
    getWeb3
};


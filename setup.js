
const fs = require('fs');
const toml = require('toml');
const config = toml.parse(fs.readFileSync('.\\test-data\\config.toml', 'utf-8'));
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(config.url));
const contracts = require("./test-data/" + config.network + "-contracts.js");
const testData = require("./test-data/blocks.js");
const PoaNetworkConsensusContract = new web3.eth.Contract(contracts.PoaNetworkConsensusAbi, contracts.PoaNetworkConsensusAddress);
const utils = require('web3-utils');
const BN = require('bn.js');


/**
 * Obtains validators from the PoaNetworkConsensus contract
 * @returns {Promise.<*>}
 */
 async function getValidators() {
    let validatorsArr = await PoaNetworkConsensusContract.methods.getValidators().call();
    console.log('getValidators() ');
    return validatorsArr;
}

module.exports = {
    config,
    web3,
    testData,
    utils,
    BN,
    getValidators
};


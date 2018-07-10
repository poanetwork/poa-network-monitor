const fs = require('fs');
const toml = require('toml');
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));


function getNetworkName() {
    let network = "";
    if (process.argv.length > 2) {
        switch (process.argv[2]) {
            case 'sokol':
                network = 'sokol';
                break;
            case 'core':
                network = 'core';
                break;
            default:
                network = config.network;
        }
    }
    else {
        network = config.network;
    }
    console.log("getNetworkName, return: " + network);
    return network;
}

module.exports = {
    config,
    getNetworkName,
};


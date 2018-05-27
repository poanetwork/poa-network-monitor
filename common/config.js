const fs = require('fs');
const toml = require('toml');
const config = toml.parse(fs.readFileSync('./config.toml', 'utf-8'));
const networkName = config.network;

module.exports = {
    config,
    networkName
};


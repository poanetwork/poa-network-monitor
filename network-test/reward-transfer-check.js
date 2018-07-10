const {
    getNetworkName,
    getWeb3,
    contracts,
    testHelper,
} = require('./test-helper.js');
let web3 = getWeb3();
const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());
const KeysManagerContract = new web3.eth.Contract(contracts.KeysManagerAbi, contracts.KeysManagerAddress);
sqlDao.createRewardTransferTable();

/**
 * Checks if accumulated reward is transferred from the validator's mining key to the payout key during last hour
 * @returns {Promise.<void>}
 */
async function checkRewardTransfers() {
    const validatorsArr = await testHelper.getValidators(web3);
    let masterOfCeremony = await
        KeysManagerContract.methods.masterOfCeremony().call();
    for (let validator of validatorsArr) {
        console.log("validator: " + validator);
        // Master of Ceremony doesn't have payout key
        if (validator === masterOfCeremony) {
            console.log("masterOfCeremony ");
            continue;
        }
        let result = await checkValidatorRewardTransfer(validator);
        await sqlDao.addToRewardTransfer([new Date(Date.now()).toISOString(), (result.passed) ? 1 : 0, result.validator,
            result.payoutKey, result.error, result.blockNumber, JSON.stringify(result.transferTx), JSON.stringify(result.otherTxs)]);
    }
    sqlDao.closeDb();
}

checkRewardTransfers();

/**
 * Checks reward transfer for the specified validator
 * @param validator
 * @returns {Promise.<{passed: boolean, validator: *, payoutKey: *, error: string, transferTx: {}, otherTxs: Array, blockNumber: string}>}
 */
async function checkValidatorRewardTransfer(validator) {
    console.log('--- checkValidatorRewardTransfer(), validator: ' + validator);
    let payoutKey = await KeysManagerContract.methods.getPayoutByMining(validator).call();
    console.log('payoutKey: ' + payoutKey);
    let result = {
        passed: true,
        validator: validator,
        payoutKey: payoutKey,
        error: "",
        transferTx: {},
        otherTxs: [],
        blockNumber: ""
    };
    if (payoutKey === "0x0000000000000000000000000000000000000000") {
        result.passed = false;
        result.error = "Validator doesn't have payout key!";
        console.log("Validator doesn't have payout key! ");
        return result;
    }

    let currentTimestamp = Date.now();
    let hourAgoTimestamp = currentTimestamp - 3600 * 1000;
    let currentBlockNumber = (await web3.eth.getBlock("latest")).number;
    let block;
    // in case of errors in getting blocks
    let maxAttempts = 1000;
    for (let i = 0; i < maxAttempts; i++) {
        try {
            block = await web3.eth.getBlock(currentBlockNumber, true);
            result.blockNumber = currentBlockNumber;
            if (block && block.transactions) {
                block.transactions.forEach(async function (tx) {
                    if (validator === tx.from) {
                        if (payoutKey === tx.to) {
                            console.log("found transfer tx at block: " + currentBlockNumber + " hash: " + tx.hash + ", from: " + tx.from, +", to: " + tx.to);
                            result.transferTx = tx;
                        }
                        else {
                            console.log("other tx at block: " + currentBlockNumber + " hash: " + tx.hash + ", from: " + tx.from, +", to: " + tx.to);
                            // check if payout key was just changed
                            let newPayoutKey = await KeysManagerContract.methods.getPayoutByMining(validator).call();
                            if (newPayoutKey !== tx.to) {
                                result.otherTxs.push(tx);
                            } else {
                                console.log("payout key was changed, transfer tx at block: " + currentBlockNumber + " hash: " + tx.hash + ", from: " + tx.from, +", to: " + tx.to);
                                result.transferTx = tx;
                            }

                        }
                    }
                });
                if (result.transferTx.to) {
                    //transfer tx is found
                    return result;
                }
            }
            // checked last hour
            if (hourAgoTimestamp > block.timestamp * 1000) {
                console.log("Didn't find tx, last block: " + block.number + " at time " + new Date(block.timestamp * 1000).toLocaleString() +
                    ", started at " + new Date(currentTimestamp).toLocaleString());
                result.passed = false;
                result.error = "Didn't find transaction, checked " + i + " blocks from block: " + currentBlockNumber;
                return result;
            }
        } catch (e) {
            console.error("Error in block " + currentBlockNumber, e);
            result.error += " error in block " + currentBlockNumber + ": " + error;
        }
        currentBlockNumber--;
    }
    result.passed = false;
    result.error += " Didn't find transaction in " + maxAttempts + " attempts";
    return result;
}




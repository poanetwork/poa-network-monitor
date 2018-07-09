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

async function checkRewardTransfers() {
    console.log("checkRewardTransfer");
    let t = await web3.eth.getTransaction("0x74f70eb95e0194a6122b8ab915a10d73c38dc6ec4c9e0422d09abbbce67ae8e6");
    console.log("t : " + JSON.stringify(t));
    console.log("time : " + new Date((await web3.eth.getBlock(3403830)).timestamp * 1000).toLocaleString());
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

async function checkValidatorRewardTransfer(validator) {
    console.log('---- checkValidatorRewardTransfer(), validator: ' + validator);
    let payoutKey = await
        KeysManagerContract.methods.getPayoutByMining(validator).call();
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
    let maxAttempts = 800;
    for (let i = 0; i < maxAttempts; i++) {
        try {
            block = await web3.eth.getBlock(currentBlockNumber, true);
            result.blockNumber = currentBlockNumber;
            if (block && block.transactions) {
                block.transactions.forEach(function (tx) {
                    if (validator === tx.from) {
                        if (payoutKey === tx.to) {
                            console.log("found tx at block: " + currentBlockNumber + " hash: " + tx.hash + ", from: " + tx.from, +", to: " + tx.to);
                            result.transferTx = tx;
                        }
                        else {
                            console.log("other tx at block: " + currentBlockNumber + " hash: " + tx.hash + ", from: " + tx.from, +", to: " + tx.to);
                            result.otherTxs.push(tx);
                        }
                    }
                });
                if (result.transferTx.to) {
                    return result;
                }
            }
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




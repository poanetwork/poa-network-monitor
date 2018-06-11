const {
    config,
    getNetworkName
} = require('./common/config.js');
const networkName = getNetworkName();
const https = require('http');
let time = 3600;
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (!(Number.isInteger(val) && val > 0)) {
        time = val;
        console.log('time: ' + time);
    }
});
Slack = require('node-slackr');
slack = new Slack(config.slackWebHookUrl, {
    channel: "#monitor"
});
let url = 'http://localhost:3000/' + networkName + '/api/failed?lastseconds=' + time;
console.log("url: " + url);
https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', async () => {
        let missingRoundTest = JSON.parse(data).missingRoundCheck;
        if (missingRoundTest.runs.length > 0) {
            console.log("missingRoundTest didn't pass: " + JSON.stringify(missingRoundTest.runs));
            await sendSimpleAlert("Failed test: \n*" + missingRoundTest.description + "*");
            let runs = missingRoundTest.runs;
            for (let i = 0; i < runs.length; i++) {
                let run = runs[i];
                if (!run.passed) {
                    let runsMessage = "Time: " + run.time + "\nlast block: " + run.lastBlock + ",\nmissed validators: " + run.missedValidators + "\n";
                    await sendAttachment("", runsMessage, true);
                }
            }
        }
        let miningRewardTest = JSON.parse(data).miningRewardCheck;
        if (miningRewardTest.runs.length > 0) {
            console.log("miningRewardTest didn't pass: " + JSON.stringify(miningRewardTest.runs));
            await sendSimpleAlert("Failed test: \n*" + miningRewardTest.description + "*");
            let runs = miningRewardTest.runs;
            for (let i = 0; i < runs.length; i++) {
                let run = runs[i];
                if (!run.passed) {
                    let rewardDetails = "\nvalidator: " + run.rewardDetails.validator + "\nblock: " + run.rewardDetails.block + "\ngasUsed: " + run.rewardDetails.gasUsed +
                        "\nbasicReward: " + run.rewardDetails.basicReward + "\nexpectedReward: " + run.rewardDetails.expectedReward +
                        "\nactualReward: " + run.rewardDetails.actualReward + "\ntxsNumber: " + run.rewardDetails.txsNumber;
                    let transactions = "";
                    for (tx of run.transactions) {
                        transactions += "\nHash: " + tx.hash + "\n price: " + tx.price + "\nvalue: " + tx.value +
                            "\ngasPrice: " + tx.gasPrice + "\ngasUsed: " + tx.gasUsed + ";";
                    }
                    let runsMessage = "Time: " + run.time + "\nerror: " + run.error + "\nreward details: " + rewardDetails + "\ntransactions: " + transactions + "\n";
                    await sendAttachment("", runsMessage, true);
                }
            }
        }
        let missingTxsTest = JSON.parse(data).missingTxsCheck;
        if (missingTxsTest.runs.length > 0) {
            console.log("MissingTxsTest didn't pass: " + JSON.stringify(missingTxsTest.runs));
            await sendSimpleAlert("Failed test: \n*" + missingTxsTest.description + "*");
            let runs = missingTxsTest.runs;
            for (let i = 0; i < runs.length; i++) {
                let run = runs[i];
                if (!run.passed) {
                    let validatorsMissedTxs = run.validatorsMissedTxs.length > 0 ? ("\nvalidators who didn't mine txs in " + config.maxRounds + " rounds: " + run.validatorsMissedTxs) : "";
                    let failedTxs = run.failedTxs.length > 0 ? ("\nfailed txs: " + JSON.stringify(run.failedTxs)) : "";
                    await sendAttachment("", "Time: " + run.time + "\nlast block: " + run.lastBlock + validatorsMissedTxs + failedTxs, true);
                }
            }
        }
        let txsPublicRpcTest = JSON.parse(data).txsViaPublicRpcCheck;
        if (txsPublicRpcTest.runs.length > 0) {
            console.log("txsPublicRpcTest didn't pass: " + JSON.stringify(txsPublicRpcTest.runs));
            await sendSimpleAlert("Failed test: \n*" + txsPublicRpcTest.description + "*");
            let runs = txsPublicRpcTest.runs;
            for (let i = 0; i < runs.length; i++) {
                let run = runs[i];
                if (!run.passed) {
                    await sendAttachment("", "Time: " + run.time + "\nerror message: " + run.errorMessage + "\ntransaction hash: " + run.transactionHash +
                        "\nblock number: " + run.blockNumber + "\nminer: " + run.miner, true);
                }
            }
        }


        let reorgsCheckTest = JSON.parse(data).reorgsCheck;
        if (reorgsCheckTest.reorgs.length > 0) {
            //console.log("reorgsCheckTest : " + JSON.stringify(reorgsCheckTest.reorgs));
            //await sendSimpleAlert("*Reorgs:* \n");
            let reorgs = reorgsCheckTest.reorgs;

            console.log("reorgs.length: " + reorgs.length);
            for (let i = 0; i < reorgs.length; i++) {
                console.log("i: " + i);
                let reorg = reorgs[i];
                let blocks = reorg.changedBlocks;
                console.log("blocks.length: " + blocks.length);
                if (blocks.length > 0) {
                    await sendAttachment("Reorgs", "Time: " + reorg.time + "\nto block: " + reorg.toBlock + "\n ", true);
                    for (let j = 0; j < blocks.length; j++) {
                        let blocksMessage = "";
                        console.log("j: " + j);
                        let changedBlock = blocks[j];
                        blocksMessage += "\n*Excluded block:*\nnumber: " + changedBlock.excluded.number + "\nhash: " + changedBlock.excluded.hash + "\nminer: " + changedBlock.excluded.miner +
                            "\n\n*Accepted block:*\nnumber: " + changedBlock.accepted.number + "\nhash: " + changedBlock.accepted.hash + "\nminer: " + changedBlock.accepted.miner;
                        await sendAttachment("", blocksMessage, false);
                    }
                }
            }
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});

//todo color
function sendAttachment(messageTitle, messageValue, includeNetworkName) {
    let messages = {
        text: includeNetworkName ? networkName : "",
        channel: "#monitor",
        attachments: [
            {
                fallback: "Detected failed tests",
                color: networkName === "core" ? "#4c0ba6" : "#ece86d",
                fields: [
                    {
                        title: messageTitle,
                        value: messageValue,
                        short: false
                    }
                ]
            }
        ]
    };
    return new Promise((resolve, reject) => {
        slack.notify(messages, (err, result) => {
            if (err) {
                console.log('Slack error: ' + err);
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

function sendSimpleAlert(messageText) {
    let messages = {
        text: messageText,
        channel: "#monitor"
    };
    return new Promise((resolve, reject) => {
        slack.notify(messages, (err, result) => {
            if (err) {
                console.log('Slack error: ' + err);
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}
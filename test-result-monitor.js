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
                    let runsMessage = "Time: " + run.time + ",\nmissed validators: " + run.missedValidators + "\n";
                    await sendAttachment("", runsMessage, "");
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
                    let runsMessage = "Time: " + run.time + "\nerror: " + run.error + "\nreward details: " + JSON.stringify(run.rewardDetails) + "\ntransactions: " + JSON.stringify(run.transactions) + "\n";
                    await sendAttachment("", runsMessage, "");
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
                    await sendAttachment("", "Time: " + run.time + validatorsMissedTxs + failedTxs, "");
                    let txs = run.transactions;
                }
            }
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});

//todo color
function sendAttachment(messageTitle, messageValue, messageText) {
    let messages = {
        text: networkName + ": " + messageText,
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
        text: networkName + ": " + messageText,
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
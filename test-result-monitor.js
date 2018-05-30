const {
    config
} = require('./common/config.js');
const https = require('http');
let time = 3600;
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (!(Number.isInteger(val) && val >= 0)) {
        time = val;
        console.log('time: ' + time);
    }
});
Slack = require('node-slackr');
slack = new Slack(config.slackWebHookUrl, {
    channel: "#monitor"
});

https.get('http://localhost:3000/api/failed?from=' + time, (resp) => {
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
                let run = runs[0];
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
                let run = runs[0];
                if (!run.passed) {
                    let missedValidators = run.missedValidators.length > 0 ? (",\nmissed validators: " + run.missedValidators) : "";
                    let runsMessage = "Time: " + run.time + ",\nerror: " + run.error + missedValidators + "\n"
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
                let run = runs[0];
                if (!run.passed) {
                    let errorMessage = run.errorMessage ? (",\nerror: " + run.errorMessage) : "";
                    let missedValidators = run.missedValidators.length > 0 ? (",\nmissed validators: " + run.missedValidators) : "";
                    let runsMessage = "time: " + run.time + errorMessage + missedValidators;
                    await sendAttachment("", runsMessage, "");
                    let txs = run.transactions;
                    for (let i = 0; i < txs.length; i++) {
                        if (txs[i].passed === false) {
                            runsMessage = "Wrong tx at block: " + txs[i].number + ",\ntransactionHash: " + txs[i].transactionHash + ",\nerrorMessage: " + txs[i].errorMessage + "\n";
                            await sendAttachment("", runsMessage, "");
                        }
                    }
                }
            }
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});

function sendAttachment(messageTitle, messageValue, messageText) {
    let messages = {
        text: messageText,
        channel: "#monitor",
        attachments: [
            {
                fallback: "Detected failed tests",
                color: "#4c0ba6",
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
const {sqlDao} = require('../common/dao.js');
let express = require('express');
let app = express();

function sendJson(result, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
}

app.get('/api/all', async function (request, response) {
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let result = await getTests(true, lastSeconds);
    sendJson(result, response);
});

app.get('/api/failed', async function (request, response) {
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let result = await getTests(false, lastSeconds);
    sendJson(result, response);
});

async function getTests(passed, lastSeconds) {
    let resultMissingRounds = {description: "Check if any validator nodes are missing rounds", runs: []};
    let resultMissingTxs = {
        description: "Check that all validator nodes are able to mine non-empty blocks",
        runs: []
    };
    let resultMiningReward = {
        description: "Check if payout script works properly for all nodes (check mining address balance)",
        runs: []
    };

    let txsRuns;
    let roundsRuns;
    let rewardsRuns;
    if (passed) {
        txsRuns = await sqlDao.getMissedTxs(lastSeconds);
        roundsRuns = await sqlDao.getMissedRounds(lastSeconds);
        rewardsRuns = await sqlDao.getRewards(lastSeconds);
    }
    else {
        txsRuns = await sqlDao.getFailedMissedTxs(lastSeconds);
        roundsRuns = await sqlDao.getFailedMissedRounds(lastSeconds);
        rewardsRuns = await sqlDao.getFailedRewards(lastSeconds);
    }

    if (txsRuns.length > 0) {
        txsRuns.map(function (tx) {
            tx.validatorsMissedTxs = JSON.parse(tx.validatorsMissedTxs);
            tx.failedTxs = JSON.parse(tx.failedTxs);
        });
        resultMissingTxs.runs = txsRuns;
    }

    if (roundsRuns.length > 0) {
        roundsRuns.map(function (run) {
            run.missedValidators = JSON.parse(run.missedValidators);
        });
        resultMissingRounds.runs = roundsRuns;
    }

    if (rewardsRuns.length > 0) {
        rewardsRuns.map(function (run) {
            run.rewardDetails = JSON.parse(run.rewardDetails);
            run.transactions = JSON.parse(run.transactions);
        });
        resultMiningReward.runs = rewardsRuns;
    }

    return {
        missingRoundCheck: resultMissingRounds,
        missingTxsCheck: resultMissingTxs,
        miningRewardCheck: resultMiningReward
    };
}

function createTablesIfNotExist() {
    sqlDao.createMissingRoundsTable();
    sqlDao.createRewardTable();
    sqlDao.createTxsTable();
}

function getLastSeconds(request) {
    let time = parseInt(request.query["lastseconds"]);
    if (!(typeof time === 'number' && Math.sign(time) === 1)) {
        time = undefined;
    }
    return time;
}

app.listen(3000, function () {
    console.log('Listening.. ');
    createTablesIfNotExist();
});
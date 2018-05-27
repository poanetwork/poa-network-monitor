const {sqlDao} = require('../common/dao.js');
let express = require('express');
let app = express();

function sendJson(result, response) {
    console.log("send result: " + JSON.stringify(result));
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
}

app.get('/api/all', async function (request, response) {
    let result = await getTests(true);
    sendJson(result, response);
});

app.get('/api/failed', async function (request, response) {
    let result = await getTests(false);
    sendJson(result, response);
});

async function getTests(passed) {
    let resultMissingRounds = {description: "Check if any validator nodes are missing rounds", runs: []};
    let resultMissingTxs = {
        description: "Check that all validator nodes are able to mine non-empty blocks",
        runs: []
    };
    let resultMiningReward = {
        description: "check if payout script works properly for all nodes (check mining address balance)",
        runs: []
    };

    let txsRuns;
    let roundsRuns;
    let rewardsRuns;
    if (passed) {
        txsRuns = await sqlDao.getMissedTxs();
        roundsRuns = await sqlDao.getMissedRounds();
        rewardsRuns = await   sqlDao.getRewards();
    }
    else {
        txsRuns = await sqlDao.getFailedMissedTxs();
        roundsRuns = await sqlDao.getFailedMissedRounds();
        rewardsRuns = await   sqlDao.getFailedRewards();
    }

    if (txsRuns.length > 0) {
        txsRuns.map(function (tx) {
            tx.transactions = JSON.parse(tx.transactions);
            tx.missedValidators = JSON.parse(tx.missedValidators);
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
            run.wrongRewards = JSON.parse(run.wrongRewards);
            run.missedValidators = JSON.parse(run.missedValidators);
        });
        resultMiningReward.runs = rewardsRuns;
    }

    return {
        missingRoundCheck: resultMissingRounds,
        missingTxsCheck: resultMissingTxs,
        miningRewardCheck: resultMiningReward
    };
}

app.listen(3000, function () {
    console.log('Listening.. ');
});
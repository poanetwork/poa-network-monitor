const {
    getMissedRounds,
    getRewards,
    getMissedTxs,
    getFailedMissedRounds,
    getFailedRewards,
    getFailedMissedTxs
} = require('./dao.js');

let express = require('express');
let app = express();

app.get('/', async function (req, res) {
    let result = await getTests(true);
    console.log("send result: " + JSON.stringify(result));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));

});

app.get('/failed', async function (req, res) {
    let result = await getTests(false);
    console.log("send result: " + JSON.stringify(result));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
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
    if (passed) {
        txsRuns = await getMissedTxs();
    }
    else {
        txsRuns = await getFailedMissedTxs();
    }
    if (txsRuns.length > 0) {
        txsRuns.map(function (tx) {
            tx.transactions = JSON.parse(tx.transactions);
            tx.missedValidators = JSON.parse(tx.missedValidators);
        });
        resultMissingTxs.runs = txsRuns;
    }

    let roundsRuns;
    if (passed) {
        roundsRuns = await getMissedRounds();
    }
    else {
        roundsRuns = await getFailedMissedRounds();
    }
    if (roundsRuns.length > 0) {
        roundsRuns.map(function (run) {
            run.missedValidators = JSON.parse(run.missedValidators);
        });
        resultMissingRounds.runs = roundsRuns;

    }

    let rewardsRuns;
    if (passed) {
        rewardsRuns = await getRewards();
    }
    else {
        rewardsRuns = await getFailedRewards();
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
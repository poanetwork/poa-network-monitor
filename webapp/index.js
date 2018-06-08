const {SqlDao} = require('../common/dao.js');
let sqlDao;
let express = require('express');
let app = express();

function sendJson(result, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
}

app.get('/sokol/api/all', async function (request, response) {
    sqlDao = new SqlDao("sokol");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let result = await getTests(true, lastSeconds);
    sendJson(result, response);
});

app.get('/core/api/all', async function (request, response) {
    sqlDao = new SqlDao("core");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let result = await getTests(true, lastSeconds);
    sendJson(result, response);
});

app.get('/sokol/api/failed', async function (request, response) {
    sqlDao = new SqlDao("sokol");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let result = await getTests(false, lastSeconds);
    sendJson(result, response);
});

app.get('/core/api/failed', async function (request, response) {
    sqlDao = new SqlDao("core");
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
    let resultTxsPublicRpc = {
        description: "Periodically send txs via public rpc endpoint",
        runs: []
    };

    let resultReorgs = {
        description: "Check for reorgs",
        reorgs: []
    };

    let txsRuns;
    let roundsRuns;
    let rewardsRuns;
    let txsPublicRpcRuns;
    let reorgs;
    reorgs = await sqlDao.getReorgs(lastSeconds);
    if (reorgs.length > 0) {
        reorgs.map(function (reorg) {
            reorg.changedBlocks = JSON.parse(reorg.changedBlocks);
        });
        resultReorgs.reorgs = reorgs;
    }
    if (passed) {
        txsRuns = await sqlDao.getMissedTxs(lastSeconds);
        roundsRuns = await sqlDao.getMissedRounds(lastSeconds);
        rewardsRuns = await sqlDao.getRewards(lastSeconds);
        txsPublicRpcRuns = await sqlDao.getTxsPublicRpc(lastSeconds);
    }
    else {
        txsRuns = await sqlDao.getFailedMissedTxs(lastSeconds);
        roundsRuns = await sqlDao.getFailedMissedRounds(lastSeconds);
        rewardsRuns = await sqlDao.getFailedRewards(lastSeconds);
        txsPublicRpcRuns = await sqlDao.getFailedTxsPublicRpc(lastSeconds);
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
    if (txsPublicRpcRuns.length > 0) {
        resultTxsPublicRpc.runs = txsPublicRpcRuns;
    }


    return {
        missingRoundCheck: resultMissingRounds,
        missingTxsCheck: resultMissingTxs,
        miningRewardCheck: resultMiningReward,
        txsViaPublicRpcCheck: resultTxsPublicRpc,
        reorgsCheck: resultReorgs
    };
}

function createTablesIfNotExist() {
    createTablesForNetwork(new SqlDao("sokol"));
    createTablesForNetwork(new SqlDao("core"));
}

function createTablesForNetwork(sqlDao) {
    sqlDao.createMissingRoundsTable();
    sqlDao.createRewardTable();
    sqlDao.createTxsTable();
    sqlDao.createTxsPublicRpcTable();
    sqlDao.createReorgsTable();
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
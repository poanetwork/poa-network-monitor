const {SqlDao} = require('../common/dao.js');
let sqlDao;
let express = require('express');
let app = express();

function sendJson(result, response) {
    response.header("Access-Control-Allow-Origin", "*");
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(result));
}

app.get('/sokol/api/all', async function (request, response) {
    sqlDao = new SqlDao("sokol");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let testNumber = getTestIndex(request);
    let result = await getTests(true, lastSeconds, testNumber);
    sendJson(result, response);
});

app.get('/core/api/all', async function (request, response) {
    sqlDao = new SqlDao("core");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let testNumber = getTestIndex(request);
    let result = await getTests(true, lastSeconds, testNumber);
    sendJson(result, response);
});

app.get('/sokol/api/failed', async function (request, response) {
    sqlDao = new SqlDao("sokol");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let testNumber = getTestIndex(request);
    let result = await getTests(false, lastSeconds, testNumber);
    sendJson(result, response);
});

app.get('/core/api/failed', async function (request, response) {
    sqlDao = new SqlDao("core");
    let lastSeconds = getLastSeconds(request);
    console.log("lastSeconds: " + lastSeconds);
    let testNumber = getTestIndex(request);
    let result = await getTests(false, lastSeconds, testNumber);
    sendJson(result, response);
});

async function getRoundsRuns(passed, lastSeconds) {
    let roundsRuns = [];
    if (passed) {
        roundsRuns = await sqlDao.getMissedRounds(lastSeconds);
    }
    else {
        roundsRuns = await sqlDao.getFailedMissedRounds(lastSeconds);
    }

    if (roundsRuns.length > 0) {
        roundsRuns.map(function (run) {
            run.missedValidators = JSON.parse(run.missedValidators);
        });
    }
    return roundsRuns;
}

async function getTxsRuns(passed, lastSeconds) {
    let txsRuns = [];
    if (passed) {
        txsRuns = await sqlDao.getMissedTxs(lastSeconds);
    }
    else {
        txsRuns = await sqlDao.getFailedMissedTxs(lastSeconds);
    }

    if (txsRuns.length > 0) {
        txsRuns.map(function (tx) {
            tx.validatorsMissedTxs = JSON.parse(tx.validatorsMissedTxs);
            tx.failedTxs = JSON.parse(tx.failedTxs);
        });

    }
    return txsRuns;
}

async function getRewardsRuns(passed, lastSeconds) {
    let rewardsRuns = [];
    if (passed) {
        rewardsRuns = await sqlDao.getRewards(lastSeconds);
    }
    else {
        rewardsRuns = await sqlDao.getFailedRewards(lastSeconds);
    }
    if (rewardsRuns.length > 0) {
        rewardsRuns.map(function (run) {
            run.rewardDetails = JSON.parse(run.rewardDetails);
            run.transactions = JSON.parse(run.transactions);
        });
    }
    return rewardsRuns;
}

async function getTxsPublicRpcRuns(passed, lastSeconds) {
    let txsPublicRpcRuns = [];
    if (passed) {
        txsPublicRpcRuns = await sqlDao.getTxsPublicRpc(lastSeconds);
    }
    else {
        txsPublicRpcRuns = await sqlDao.getFailedTxsPublicRpc(lastSeconds);
    }
    return txsPublicRpcRuns;
}

async function getReorgs(lastSeconds) {
    let reorgs = await sqlDao.getReorgs(lastSeconds);
    if (reorgs.length > 0) {
        reorgs.map(function (reorg) {
            reorg.changedBlocks = JSON.parse(reorg.changedBlocks);
        });
    }
    return reorgs;
}

async function getTests(passed, lastSeconds, testNumber) {
    console.log("getTests testNumber: " + testNumber);
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

    // if no testNumber is specified then return all tests
    if (!testNumber || testNumber === 1) {
        console.log("1");
        roundsRuns = await getRoundsRuns(passed, lastSeconds);
        resultMissingRounds.runs = roundsRuns

    }
    if (!testNumber || testNumber === 2) {
        txsRuns = await getTxsRuns(passed, lastSeconds);
        resultMissingTxs.runs = txsRuns;
    }
    if (!testNumber || testNumber === 3) {
        rewardsRuns = await getRewardsRuns(passed, lastSeconds);
        resultMiningReward.runs = rewardsRuns;

    }
    if (!testNumber || testNumber === 4) {
        txsPublicRpcRuns = await getTxsPublicRpcRuns(passed, lastSeconds);
        resultTxsPublicRpc.runs = txsPublicRpcRuns;
    }
    if (!testNumber || testNumber === 5) {
        reorgs = await getReorgs(lastSeconds);
        resultReorgs.reorgs = reorgs;
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

function getTestIndex(request) {
    // todo with enum
    let test = parseInt(request.query["test"]);
    if (typeof test !== 'number' || test < 1 || test > 5) {
        test = undefined;
    }
    console.log("test number: " + test);
    return test;
}

app.listen(3000, function () {
    console.log('Listening.. ');
    createTablesIfNotExist();
});
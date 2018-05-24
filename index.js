const {db} = require('./setup.js');
let express = require('express');
let app = express();
const Promise = require('bluebird');

app.get('/failed', function (req, res) {
    let resultMissingRounds = {description: "Check if any validator nodes are missing rounds", runs: []};
    let resultMissingTxs = {
        description: "Check that all validator nodes are able to mine non-empty blocks",
        runs: []
    };
    let resultMiningReward = {
        description: "check if payout script works properly for all nodes (check mining address balance)",
        runs: []
    };

    db.serialize(async function () {
        let txsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM missed_txs_sokol where passed = 0", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        if (txsRuns.length > 0) {
            txsRuns.map(function (tx) {
                tx.transactions = JSON.parse(tx.transactions);
                tx.missedValidators = JSON.parse(tx.missedValidators);
            });
            resultMissingTxs.runs = txsRuns;
        }

        let roundsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM missed_rounds_sokol where passed = 0", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        if (roundsRuns.length > 0) {
            roundsRuns.map(function (run) {
                run.missedValidators = JSON.parse(run.missedValidators);
            });
            resultMissingRounds.runs = roundsRuns;

        }

        let rewardsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM mining_reward_sokol where passed = 0", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        if (rewardsRuns.length > 0) {
            rewardsRuns.map(function (run) {
                run.wrongRewards = JSON.parse(run.wrongRewards);
                run.missedValidators = JSON.parse(run.missedValidators);
            });
            resultMiningReward.runs = rewardsRuns;
        }

        let result = {
            missingRoundCheck: resultMissingRounds,
            missingTxsCheck: resultMissingTxs,
            miningRewardCheck: resultMiningReward
        };
        console.log("send result: " + JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.get('/', function (req, res) {
    let resultMissingRounds = {description: "Check if any validator nodes are missing rounds", runs: []};
    let resultMissingTxs = {
        description: "Check that all validator nodes are able to mine non-empty blocks",
        runs: []
    };
    let resultMiningReward = {
        description: "check if payout script works properly for all nodes (check mining address balance)",
        runs: []
    };

    db.serialize(async function () {
        let txsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM missed_txs_sokol", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        if (txsRuns.length > 0) {
            txsRuns.map(function (tx) {
                tx.transactions = JSON.parse(tx.transactions);
                tx.missedValidators = JSON.parse(tx.missedValidators);
            });
            resultMissingTxs.runs = txsRuns;
        }


        let roundsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM missed_rounds_sokol", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        if (roundsRuns.length > 0) {
            roundsRuns.map(function (run) {
                run.missedValidators = JSON.parse(run.missedValidators);
            });
            resultMissingRounds.runs = roundsRuns;
        }
        let rewardsRuns = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM mining_reward_sokol", [], (err, rows) => {
                if (err) {
                    console.log('Error running sql: ');
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        });
        console.log('rewardsRuns: ' + rewardsRuns);
        if (rewardsRuns.length > 0) {
            rewardsRuns.map(function (run) {
                for (var key in run) {
                    console.log('key: ' + key);
                    console.log('val: ' + run[key]);

                }
                console.log('run.wrongRewards: ' + run.wrongRewards);
                run.wrongRewards = JSON.parse(run.wrongRewards);
                run.missedValidators = JSON.parse(run.missedValidators);
            });
            resultMiningReward.runs = rewardsRuns;
        }
        let result = {
            missingRoundCheck: resultMissingRounds,
            missingTxsCheck: resultMissingTxs,
            miningRewardCheck: resultMiningReward
        };
        console.log("send result: " + JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.listen(3000, function () {
    console.log('Listening.. ');
});
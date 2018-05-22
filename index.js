const {db} = require('./setup.js');
let express = require('express');
let app = express();
const Promise = require('bluebird');

app.get('/', function (req, res) {
    let resultMissingRounds = {description: "Check if any validator nodes are missing rounds", runs: []};
    let resultMissingTxs = {
        description: "Check that all validator nodes are able to mine non-empty blocks",
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
        txsRuns.map(function (tx) {
            tx.transactions = JSON.parse(tx.transactions);
            tx.missedValidators = JSON.parse(tx.missedValidators);
        });
        resultMissingTxs.runs = txsRuns;

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
        roundsRuns.map(function (run) {
            run.missedValidators = JSON.parse(run.missedValidators);
        });
        resultMissingRounds.runs = roundsRuns;
        let result = {missingRoundCheck: resultMissingRounds, missingTxsCheck: resultMissingTxs};
        console.log("send result: " + JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.listen(3000, function () {
    console.log('Listening.. ');
});
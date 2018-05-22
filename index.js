let express = require('express');
let app = express();
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('testDB.db');
const Promise = require('bluebird');
app.get('/', function (req, res) {
    let result = {description: "Check if any validator nodes are missing rounds", runs: []};
    db.serialize(async function () {
        result.runs = await new Promise((resolve, reject) => {
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
        console.log("send result: " + JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });
});

app.listen(3000, function () {
    console.log('Listening.. ');
});
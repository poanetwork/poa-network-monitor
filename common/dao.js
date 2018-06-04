let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./poa_monitor.db');

function SqlDao(networkName) {
    this.missedRoundsTableName = "missed_rounds_" + networkName;
    this.miningRewardTableName = "mining_reward_" + networkName;
    this.missedTxsTableName = "missed_txs_" + networkName;
    this.missedRoundsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.missedRoundsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " missedValidators TEXT)";
    this.miningRewardTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.miningRewardTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " error TEXT," +
        " transactions TEXT," +
        " rewardDetails TEXT)";
    this.missedTxsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.missedTxsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " validatorsMissedTxs TEXT," +
        " failedTxs TEXT)";

    this.getMissedRounds = async function (lastSeconds) {
        console.log("getMissedRounds, lastSeconds: " + lastSeconds);
        return allWithTime("SELECT * FROM " + this.missedRoundsTableName + " where 1 ", lastSeconds);
    };

    this.getFailedMissedRounds = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.missedRoundsTableName + " where passed = 0 ", lastSeconds);
    };

    this.createMissingRoundsTable = function () {
        run(this.missedRoundsTableCreateSql);
    };

    this.createRewardTable = function () {
        run(this.miningRewardTableCreateSql);
    };

    this.createTxsTable = function () {
        console.log("createTxsTable, his.missedTxsTableCreateSql: " + this.missedTxsTableCreateSql);
        run(this.missedTxsTableCreateSql);
    };

    this.addToMissingRounds = function (params) {
        run("INSERT INTO " + this.missedRoundsTableName + " (time, passed, missedValidators) VALUES ( ?, ?, ?)",
            params);
    };

    this.addToRewardTable = function (params) {
        run("INSERT INTO " + this.miningRewardTableName + " (time, passed, error, rewardDetails, transactions) VALUES ( ?, ?, ?, ?, ?)",
            params);
    };

    this.addToTxsTable = function (params) {
        run("INSERT INTO " + this.missedTxsTableName + " (time, passed, validatorsMissedTxs, failedTxs) VALUES ( ?, ?, ?, ?)",
            params);
    };

    this.getRewards = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.miningRewardTableName + " where 1 ", lastSeconds);
    };

    this.getFailedRewards = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.miningRewardTableName + " where passed = 0 ", lastSeconds);
    };

    this.getMissedTxs = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.missedTxsTableName + " where 1 ", lastSeconds);
    };

    this.getFailedMissedTxs = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.missedTxsTableName + " where passed = 0 ", lastSeconds);
    };
}

function run(sql, params) {
    db.serialize(function () {
        db.run(sql, params);
    });
}

function all(sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

function allWithTime(sql, lastSeconds) {
    if (lastSeconds) {
        let fromTime = new Date(Date.now() - lastSeconds * 1000).toLocaleString();
        console.log("fromTime: " + fromTime);
        return all(sql + " and time >= '" + fromTime + "'");
    }
    else {
        return all(sql);
    }
}

module.exports = {
    SqlDao,
};
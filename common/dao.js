const {
    networkName
} = require('./config.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./poa_monitor.db');

const missedRoundsTableName = "missed_rounds_" + networkName;
const miningRewardTableName = "mining_reward_" + networkName;
const missedTxsTableName = "missed_txs_" + networkName;
const missedRoundsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + missedRoundsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " missedValidators TEXT)";
const miningRewardTableCreateSql = " CREATE TABLE IF NOT EXISTS " + miningRewardTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " error TEXT," +
    " transactions TEXT," +
    " rewardDetails TEXT)";
const missedTxsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + missedTxsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " validatorsMissedTxs TEXT," +
    " failedTxs TEXT)";

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

let sqlDao = {
    createMissingRoundsTable: function () {
        run(missedRoundsTableCreateSql);
    },

    createRewardTable: function () {
        run(miningRewardTableCreateSql);
    },

    createTxsTable: function () {
        run(missedTxsTableCreateSql);
    },

    addToMissingRounds: function (params) {
        run("INSERT INTO " + missedRoundsTableName + " (time, passed, missedValidators) VALUES ( ?, ?, ?)",
            params);
    },

    addToRewardTable: function (params) {
        run("INSERT INTO " + miningRewardTableName + " (time, passed, error, rewardDetails, transactions) VALUES ( ?, ?, ?, ?, ?)",
            params);
    },

    addToTxsTable: function (params) {
        run("INSERT INTO " + missedTxsTableName + " (time, passed, validatorsMissedTxs, failedTxs) VALUES ( ?, ?, ?, ?)",
            params);
    },

    getMissedRounds: async function (lastSeconds) {
        console.log("getMissedRounds, lastSeconds: " + lastSeconds);
        return allWithTime("SELECT * FROM " + missedRoundsTableName + " where 1 ", lastSeconds);
    },

    getFailedMissedRounds: async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + missedRoundsTableName + " where passed = 0 ", lastSeconds);
    },

    getRewards: async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + miningRewardTableName + " where 1 ", lastSeconds);
    },

    getFailedRewards: async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + miningRewardTableName + " where passed = 0 ", lastSeconds);
    },

    getMissedTxs: async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + missedTxsTableName + " where 1 ", lastSeconds);
    },

    getFailedMissedTxs: async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + missedTxsTableName + " where passed = 0 ", lastSeconds);
    }
};

module.exports = {
    sqlDao,
};
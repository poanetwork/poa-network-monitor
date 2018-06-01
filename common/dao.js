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
    " wrongRewards TEXT)";
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
        run("INSERT INTO " + miningRewardTableName + " (time, passed, error, wrongRewards) VALUES ( ?, ?, ?, ?)",
            params);
    },

    addToTxsTable: function (params) {
        run("INSERT INTO " + missedTxsTableName + " (time, passed, validatorsMissedTxs, failedTxs) VALUES ( ?, ?, ?, ?)",
            params);
    },

    getMissedRounds: async function (fromTime) {
        console.log("getMissedRounds, fromTime: " + fromTime);
        if (fromTime) {
            let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
            console.log("beginTime: " + beginTime);
            return all("SELECT * FROM " + missedRoundsTableName + " where  time >= '" + beginTime + "'");
        }
        else {
            return all("SELECT * FROM " + missedRoundsTableName);
        }
    },

    getFailedMissedRounds: async function (fromTime) {
        if (fromTime) {
            let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
            console.log("beginTime: " + beginTime);
            return all("SELECT * FROM " + missedRoundsTableName + " where passed = 0 and  time >= '" + beginTime + "'");
        }
        else {
            return all("SELECT * FROM " + missedRoundsTableName + " where passed = 0");
        }
    },

    getRewards: async function (fromTime) {
        if (fromTime) {
            let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
            return all("SELECT * FROM " + miningRewardTableName + " where  time >= '" + beginTime + "'");
        }
        else {
            return all("SELECT * FROM " + miningRewardTableName);
        }
    },

    getFailedRewards: async function (fromTime) {
        if (fromTime) {
            let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
            return all("SELECT * FROM " + miningRewardTableName + " where passed = 0 and  time >= '" + beginTime + "'");
        }
        else {
            return all("SELECT * FROM " + miningRewardTableName + " where passed = 0");
        }
    },

    getMissedTxs: async function (fromTime) {
        if (fromTime) {
            let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
            return all("SELECT * FROM " + missedTxsTableName + " where  time >= '" + beginTime + "'");
        }
        else {
            return all("SELECT * FROM " + missedTxsTableName);
        }
    },

    getFailedMissedTxs: async function (fromTime) {
        let beginTime = new Date(Date.now() - fromTime * 1000).toLocaleString();
        return all("SELECT * FROM " + missedTxsTableName + " where passed = 0 and  time >= '" + beginTime + "'");
    }
};

module.exports = {
    sqlDao,
};
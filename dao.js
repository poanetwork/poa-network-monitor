const {
    db,
    network
} = require('./setup.js');
const missedRoundsTableName = "missed_rounds_" + network;
const miningRewardTableName = "mining_reward_" + network;
const missedTxsTableName = "missed_txs_" + network;
const missedRoundsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + missedRoundsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " missedValidators TEXT)";
const miningRewardTableCreateSql = " CREATE TABLE IF NOT EXISTS " + miningRewardTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " error TEXT," +
    " wrongRewards TEXT," +
    " missedValidators TEXT)";
const missedTxsTableCreateSql = " CREATE TABLE IF NOT EXISTS missed_txs_sokol (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    " time TEXT," +
    " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
    " transactions TEXT," +
    " missedValidators TEXT)";

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
    createMissingRoundsDb: function () {
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
        run("INSERT INTO " + miningRewardTableName + " (time, passed, error, missedValidators, wrongRewards) VALUES ( ?, ?, ?, ?, ?)",
            params);
    },

    addToTxsTable: function (params) {
        run("INSERT INTO " + missedTxsTableName + " (time, passed, transactions, missedValidators) VALUES ( ?, ?, ?, ?)",
            params);
    },

    getMissedRounds: async function () {
        return all("SELECT * FROM " + missedRoundsTableName);
    },

    getFailedMissedRounds: async function () {
        return all("SELECT * FROM " + missedRoundsTableName + " where passed = 0");
    },

    getRewards: async function () {
        return all("SELECT * FROM " + miningRewardTableName);
    },

    getFailedRewards: async function () {
        return all("SELECT * FROM " + miningRewardTableName + " where passed = 0");
    },

    getMissedTxs: async function () {
        return all("SELECT * FROM " + missedTxsTableName);
    },

    getFailedMissedTxs: async function () {
        return all("SELECT * FROM " + missedTxsTableName + " where passed = 0");
    }
};

module.exports = {
    sqlDao,
};
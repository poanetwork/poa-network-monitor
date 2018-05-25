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

function createMissingRoundsDb() {
    run(missedRoundsTableCreateSql);
}

function createRewardTable() {
    run(miningRewardTableCreateSql);
}

function createTxsTable() {
    run(missedTxsTableCreateSql);
}

function addToMissingRounds(params) {
    run("INSERT INTO " + missedRoundsTableName + " (time, passed, missedValidators) VALUES ( ?, ?, ?)",
        params);
}

function addToRewardTable(params) {
    run("INSERT INTO " + miningRewardTableName + " (time, passed, error, missedValidators, wrongRewards) VALUES ( ?, ?, ?, ?, ?)",
        params);
}

function addToTxsTable(params) {
    run("INSERT INTO " + missedTxsTableName + " (time, passed, transactions, missedValidators) VALUES ( ?, ?, ?, ?)",
        params);
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

async function getMissedRounds() {
    return all("SELECT * FROM " + missedRoundsTableName);
}

async function getFailedMissedRounds() {
    return all("SELECT * FROM " + missedRoundsTableName + " where passed = 0");
}

async function getRewards() {
    return all("SELECT * FROM " + miningRewardTableName);
}

async function getFailedRewards() {
    return all("SELECT * FROM " + miningRewardTableName + " where passed = 0");

}

async function getMissedTxs() {
    return all("SELECT * FROM " + missedTxsTableName);
}

async function getFailedMissedTxs() {
    return all("SELECT * FROM " + missedTxsTableName + " where passed = 0");

}

module.exports = {
    createMissingRoundsDb,
    createRewardTable,
    createTxsTable,

    addToMissingRounds,
    addToRewardTable,
    addToTxsTable,

    getMissedRounds,
    getRewards,
    getMissedTxs,

    getFailedMissedRounds,
    getFailedRewards,
    getFailedMissedTxs
};
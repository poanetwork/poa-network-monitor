let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./poa_monitor.db');

function SqlDao(networkName) {
    this.missedRoundsTableName = "missed_rounds_" + networkName;
    this.miningRewardTableName = "mining_reward_" + networkName;
    this.missedTxsTableName = "missed_txs_" + networkName;
    this.txsPublicRpcTableName = "txs_public_rpc_" + networkName;
    this.reorgsTableName = "reorgs_" + networkName;
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

    this.txsPublicRpcTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.txsPublicRpcTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " errorMessage TEXT," +
        " transactionHash TEXT," +
        " blockNumber TEXT," +
        " miner TEXT)";

    this.reorgsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.reorgsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " toBlock TEXT," +
        " changedBlocks TEXT)";

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

    this.createTxsPublicRpcTable = function () {
        console.log("createTxsPublicRpcTable, sql: " + this.txsPublicRpcTableCreateSql);
        run(this.txsPublicRpcTableCreateSql);
    };

    this.createReorgsTable = function () {
        console.log("createReorgsTable, sql: " + this.reorgsTableCreateSql);
        run(this.reorgsTableCreateSql);
    };
    // this.reorgsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.reorgsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    //     " time TEXT," +
    //     " to TEXT," +
    //     " changedBlocks TEXT)";

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

    this.addToTxsPublicRpcTable = function (params) {
        run("INSERT INTO " + this.txsPublicRpcTableName + " (time, passed, errorMessage, transactionHash, blockNumber, miner) VALUES ( ?, ?, ?, ?, ?, ?)",
            params);
    };

    this.addToReorgsTable = function (params) {
        run("INSERT INTO " + this.reorgsTableName + " (time, toBlock, changedBlocks) VALUES ( ?, ?, ?)",
            params);
    };

    // this.reorgsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.reorgsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    //     " time TEXT," +
    //     " to TEXT," +
    //     " changedBlocks TEXT)";

    this.getReorgs = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.reorgsTableName + " where 1 ", lastSeconds);
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

    this.getTxsPublicRpc = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.txsPublicRpcTableName + " where 1 ", lastSeconds);
    };

    this.getFailedTxsPublicRpc = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.txsPublicRpcTableName + " where passed = 0 ", lastSeconds);
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
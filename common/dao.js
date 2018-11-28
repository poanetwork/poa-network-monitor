let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./poa_monitor.db');

function SqlDao(networkName) {
    this.missedRoundsTableName = "missed_rounds_" + networkName;
    this.miningRewardTableName = "mining_reward_" + networkName;
    this.missedTxsTableName = "missed_txs_" + networkName;
    this.txsPublicRpcTableName = "txs_public_rpc_" + networkName;
    this.txsInfuraTableName = "txs_Infura_" + networkName;
    this.reorgsTableName = "reorgs_" + networkName;
    this.rewardTransferTableName = "reward_transfer_" + networkName;
    this.rewardByBlockTableName = "reward_by_block_" + networkName;

    // Create

    this.missedRoundsTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.missedRoundsTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " lastBlock TEXT," +
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
        " lastBlock TEXT," +
        " validatorsMissedTxs TEXT," +
        " failedTxs TEXT)";

    this.txsPublicRpcTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.txsPublicRpcTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " errorMessage TEXT," +
        " transactionHash TEXT," +
        " blockNumber TEXT," +
        " miner TEXT)";

    this.txsInfuraTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.txsInfuraTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
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

    this.rewardTransferTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.rewardTransferTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " validator TEXT," +
        " payoutKey TEXT," +
        " error TEXT," +
        " transferTx TEXT," +
        " otherTxs TEXT," +
        " blockNumber TEXT)";

    this.rewardByBlockTableCreateSql = " CREATE TABLE IF NOT EXISTS " + this.rewardByBlockTableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " time TEXT," +
        " passed INTEGER NOT NULL CHECK (passed IN (0,1))," +
        " block INTEGER," +
        " validator TEXT," +
        " payoutKey TEXT," +
        " error TEXT)";

    this.createMissingRoundsTable = function () {
        run(this.missedRoundsTableCreateSql);
    };

    this.createRewardTable = function () {
        run(this.miningRewardTableCreateSql);
    };

    this.createTxsTable = function () {
        run(this.missedTxsTableCreateSql);
    };

    this.createTxsPublicRpcTable = function () {
        run(this.txsPublicRpcTableCreateSql);
    };

    this.createTxsInfuraTable = function () {
        run(this.txsInfuraTableCreateSql);
    };

    this.createReorgsTable = function () {
        run(this.reorgsTableCreateSql);
    };

    this.createRewardTransferTable = function () {
        run(this.rewardTransferTableCreateSql);
    };

    this.createRewardByBlockTable = function () {
        run(this.rewardByBlockTableCreateSql);
    };

    // Insert

    this.addToMissingRounds = async function (params) {
        await run("INSERT INTO " + this.missedRoundsTableName + " (time, passed, lastBlock, missedValidators) VALUES ( ?, ?, ?, ?)",
            params);
    };

    this.addToRewardTable = async function (params) {
        await run("INSERT INTO " + this.miningRewardTableName + " (time, passed, error, rewardDetails, transactions) VALUES ( ?, ?, ?, ?, ?)",
            params);
    };

    this.addToTxsTable = async function (params) {
        await run("INSERT INTO " + this.missedTxsTableName + " (time, passed, lastBlock, validatorsMissedTxs, failedTxs) VALUES ( ?, ?, ?, ?, ?)",
            params);
    };

    this.addToTxsPublicRpcTable = async function (params) {
        await run("INSERT INTO " + this.txsPublicRpcTableName + " (time, passed, errorMessage, transactionHash, blockNumber, miner) VALUES ( ?, ?, ?, ?, ?, ?)",
            params);
    };

    this.addToTxsInfuraTable = async function (params) {
        await run("INSERT INTO " + this.txsInfuraTableName + " (time, passed, errorMessage, transactionHash, blockNumber, miner) VALUES ( ?, ?, ?, ?, ?, ?)",
            params);
    };

    this.addToReorgsTable = async function (params) {
        await run("INSERT INTO " + this.reorgsTableName + " (time, toBlock, changedBlocks) VALUES ( ?, ?, ?)",
            params);
    };

    this.addToRewardTransfer = async function (params) {
        await run("INSERT INTO " + this.rewardTransferTableName + " (time, passed, validator, payoutKey, error, blockNumber, transferTx, otherTxs) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)",
            params);
    };

    this.addToRewardByBlockTable = async function (params) {
        await run("INSERT INTO " + this.rewardByBlockTableName + " (time, passed, block, validator, payoutKey, error) VALUES ( ?, ?, ?, ?, ?, ?)",
            params);
    };

    // Select

    this.getMissedRounds = async function (lastSeconds) {
        console.log("getMissedRounds, lastSeconds: " + lastSeconds);
        return await allWithTime("SELECT * FROM " + this.missedRoundsTableName + " where 1 ", lastSeconds);
    };

    this.getFailedMissedRounds = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.missedRoundsTableName + " where passed = 0 ", lastSeconds);
    };

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

    this.getTxsInfura = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.txsInfuraTableName + " where 1 ", lastSeconds);
    };

    this.getFailedTxsPublicRpc = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.txsPublicRpcTableName + " where passed = 0 ", lastSeconds);
    };

    this.getFailedTxsInfura = async function (lastSeconds) {
        return allWithTime("SELECT * FROM " + this.txsInfuraTableName + " where passed = 0 ", lastSeconds);
    };

    this.getRewardTransfers = async function (lastSeconds) {
        return await allWithTime("SELECT * FROM " + this.rewardTransferTableName + " where 1 ", lastSeconds);
    };

    this.getFailedRewardTransfers = async function (lastSeconds) {
        return await allWithTime("SELECT * FROM " + this.rewardTransferTableName + " where passed = 0 ", lastSeconds);
    };

    this.getRewardByBlock = async function (lastSeconds) {
        return await allWithTime("SELECT * FROM " + this.rewardByBlockTableName + " where 1 ", lastSeconds);
    };

    this.getFailedRewardByBlock = async function (lastSeconds) {
        return await allWithTime("SELECT * FROM " + this.rewardByBlockTableName + " where passed = 0 ", lastSeconds);
    };

    this.getLatestRewardByBlockRecord = async function () {
        return await all("SELECT * FROM " + this.rewardByBlockTableName + " where block = (SELECT MAX(block)  FROM " + this.rewardByBlockTableName + ") ");
    };


    this.closeDb = function () {
        db.close();
    };

}

function run(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, respose) => {
            if (err) {
                console.log('Error running sql: ' + sql);
                console.log(err);
                reject(err);
            } else {
                resolve(respose);
            }
        })
    })

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
        let fromTime = new Date(Date.now() - lastSeconds * 1000).toISOString();
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
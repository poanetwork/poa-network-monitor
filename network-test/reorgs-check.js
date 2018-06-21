const {
    getNetworkName,
    getWeb3,
    config
} = require('./test-helper.js');
const web3 = getWeb3(true);
const network = getNetworkName();

const {SqlDao} = require('../common/dao.js');
const sqlDao = new SqlDao(getNetworkName());
sqlDao.createReorgsTable();
let reorgToNumber = -1;
let reorg;

let blocks = {};
let firstBlock = -1;
let lastBlock = -1;
let maxBlocks = config.maxBlocksToSave;

/**
 * Checks if parent hashes of saved blocks equal to the hashes of previous blocks.
 * Returns false if some blocks were changed or after receiving blocks with greater block number, it can happen while reorg.
 * Can be used for determining if reorg is finished and all new blocks are received (in case if more then one block were changed )
 * @param from number of block to start with
 * @returns {boolean}
 */
function checkIsSynced(from) {
    console.log("checkIsSynced()");
    for (let i = from; i < lastBlock; i++) {
        if (!blocks[i] || !blocks[i + 1]) {
            console.log("blocks doesn't exist");
            return false;
        }
        if (blocks[i].hash !== blocks[i + 1].parentHash) {
            console.log("doesn't fit: i: " + i + ", blocks[i].hash: " + blocks[i].hash + ", blocks[i+1].parentHash: " + blocks[i + 1].parentHash);
            return false;
        }
        console.log("Synced true");
        return true;
    }
}

/**
 * Compares saved block with blocks in the network.
 * If blocks hashes are not equal, saves saved block as excluded and block from network as accepted to the object and then calls method for saving reorg.
 * @param to
 * @returns {Promise.<void>}
 */
async function checkPreviousHashesAndSave(to) {
    let reorgToSave = {to: "", changedBlocks: []};
    reorgToSave.to = to;
    console.log("checkPreviousHashes() to: " + to + " from: " + firstBlock);
    // clone to new object as original blocks can be changed while checking
    let blocksToCheck = JSON.parse(JSON.stringify(blocks));
    let from = firstBlock;
    for (let i = to; i >= from; i--) {
        console.log("i: " + i);
        let ethBlock = await web3.eth.getBlock(i);
        if (blocksToCheck[i] && blocksToCheck[i].hash !== ethBlock.hash) {
            let changedBlock = {excluded: blocksToCheck[i], accepted: ethBlock};
            reorgToSave.changedBlocks.push(changedBlock);
            console.log("-- reorg " + i + ", from " + blocksToCheck[i].hash + " to " + ethBlock.hash);
            if (blocks[i]) {
                blocks[i] = ethBlock;
            }
        }
        else {
            console.log("hashes are equal");
        }
    }
    saveReorgs(reorgToSave);
    reorg = undefined;
}

/**
 * Saves next received block. If maximum number of saved blocks is achieved then the first saved block will be removed
 * @param block
 */
function addNextBlock(block) {
    console.log("addNextBlock() + block.number:" + block.number);
    blocks[lastBlock + 1] = block;
    lastBlock++;
    if (lastBlock - firstBlock >= maxBlocks) {
        removeFirst();
    }
    console.log("firstBlock: " + firstBlock + ", lastBlock: " + lastBlock);
}

/**
 * Removes the oldest of saved blocks
 */
function removeFirst() {
    delete blocks[firstBlock];
    firstBlock++;
    console.log("removed first, firstBlock: " + firstBlock + ", lastBlock: " + lastBlock);
}

checkForReorgs()
    .then(result => {
        console.log("checkForReorgs done ");
    })
    .catch(err => {
        console.log("Error in checkForReorgs: " + err);
    });

/**
 * Saves reorg to the database if it contains any changed blocks
 * @param reorg
 */
function saveReorgs(reorg) {
    console.log("saveReorgs(): " + JSON.stringify(reorg));
    if (reorg.changedBlocks.length > 0) {
        sqlDao.addToReorgsTable([new Date(Date.now()).toISOString(), reorg.to, JSON.stringify(reorg.changedBlocks)]);
    }
    else {
        console.log("no changed blocks");
    }
}

/**
 * Must be called if a new block is received with the same block number as already saved one.
 * Saves changed block to the reorg object and replaces saved block with the new one.
 * Doesn't save reorg to the database because it can be not the last changed block
 * @param blockHeader
 */
function gotReplacement(blockHeader) {
    console.log("gotReplacement() ");
    // reorg object will exist if it's not the first changed block while reorg
    if (!reorg) {
        reorg = {to: lastBlock, changedBlocks: []};
        reorgToNumber = lastBlock;
        console.log("reorgToNumber: " + reorgToNumber);
    }
    console.log("-- reorg " + blockHeader.number);

    // save changed block, wait until receiving all changed blocks, then save reorg
    let excludedBlock = blocks[blockHeader.number];
    if (excludedBlock && excludedBlock.hash !== blockHeader.hash) {
        let changedBlock = {excluded: excludedBlock, accepted: blockHeader};
        console.log("changedBlock: " + JSON.stringify(changedBlock));
        reorg.changedBlocks.push(changedBlock);
    }

    // will not exist if before an block with higher number was received (can happen while reorg)
    if (!excludedBlock) {
        // number of saved blocks increased, so need to remove the old one to keep number of saved blocks constant
        removeFirst();
    }
    blocks[blockHeader.number] = blockHeader;
}

/**
 * Must be called if a new block is received with the block number equal to the last saved plus 1.
 * Conducts some checks for the reorgs and then saves block
 *
 * @param blockHeader
 */
function gotNextBlock(blockHeader) {
    console.log("gotNextBlock() ");
    if (reorg) {
        // means some block was already changed while reorg and this can be next one
        if (checkIsSynced(reorgToNumber)) {
            //save reorged blocks after all changed blocks are received
            console.log("finished reorg: " + blockHeader.number);
            reorgToNumber = -1;
            saveReorgs(reorg);
            reorg = undefined;
        }
    } else {
        if (blocks[lastBlock] && blockHeader.parentHash !== blocks[lastBlock].hash) {
            // got replacement for the last saved block
            reorgToNumber = lastBlock;
            checkPreviousHashesAndSave(reorgToNumber);
        }
    }
    addNextBlock(blockHeader);
}

/**
 * Must be called if a new block is received with the higher block number then the last saved plus 1.
 Creates reorg object if it wasn't created, calls checkPreviousHashesAndSave method for checking for changed blocks and saving them to the database,
 then remove an old saved block to keep number of saved blocks constant

 * @param blockHeader
 */
function gotHigherBlockNumber(blockHeader) {
    console.log("gotHigherBlockNumber() ");
    if (!reorg) {
        reorg = {to: lastBlock, changedBlocks: []};
        reorgToNumber = lastBlock;
        console.log("reorgToNumber: " + reorgToNumber);
    }
    console.log("got higher number then expected: " + blockHeader.number + " instead of " + lastBlock);
    checkPreviousHashesAndSave(reorgToNumber);
    blocks[blockHeader.number] = blockHeader;
    console.log("add: " + blockHeader.number);
    lastBlock = blockHeader.number;
    removeFirst();
}

/**
 * Subscribes for receiving new blocks added to the chain. After getting new block compares it's number with the number of last saved block and calls appropriate function.
 * @returns {Promise.<void>}
 */
async function checkForReorgs() {
    console.log("checkForReorgs, network: " + network);
    let subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
        if (error)
            console.log("subscription error: " + error);
    })
        .on("data", async function (blockHeader) {
            console.log("Got new block,  reorg: " + reorg + ", new block: " + blockHeader.number + ", hash: " + blockHeader.hash + ", parentHash: " + blockHeader.parentHash);
            if (firstBlock === -1) {
                // in the begin
                firstBlock = lastBlock = blockHeader.number;
                blocks[lastBlock] = blockHeader;
                console.log("add first block: " + blockHeader.number);
            }
            else {
                if (blockHeader.number <= lastBlock) {
                    gotReplacement(blockHeader);
                }
                else {
                    if (blockHeader.number === lastBlock + 1) {
                        gotNextBlock(blockHeader);
                    } else {
                        gotHigherBlockNumber(blockHeader);
                    }
                }
            }
            console.log("_____");
        });
}


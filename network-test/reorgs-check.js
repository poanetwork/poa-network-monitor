const {
    getNetworkName,
    getWeb3,
} = require('./test-helper.js');
const web3 = getWeb3(true);
const network = getNetworkName();

let isReorg = false;
let reorgToNumber = -1;

let reorg = {to: "", newBlocks: []};

let blocks = {};
let firstBlock = -1;
let lastBlock = -1;
let maxBlocks = 20;

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

async function checkPreviousHashes(to) {
    console.log("checkPreviousHashes()");
    let blocksToCheck = JSON.parse(JSON.stringify(blocks));
    let from = firstBlock;
    for (let i = to; i >= from; i--) {
        let ethBlock = await web3.eth.getBlock(i);

        if (blocksToCheck[i].hash !== ethBlock.hash) {
            console.log("-- reorg " + i + ", from " + blocksToCheck[i].hash + " to " + ethBlock.hash);
            if (blocks[i]) {
                blocks[i] = ethBlock;
            }
        }
        else {
            console.log("hashes are equal " );
        }
        console.log("Synced true");
    }
}

function addNextBlock(block) {
    console.log("addNextBlock() ");
    blocks[lastBlock + 1] = block;
    console.log("add: " + block.number);
    lastBlock++;
    if (lastBlock - firstBlock >= maxBlocks) {
        removeFirst();
    }
    console.log("firstBlock: " + firstBlock + ", lastBlock: " + lastBlock);
}

function removeFirst() {
    delete blocks[firstBlock];
    firstBlock++;
    console.log("removed first, firstBlock: " + firstBlock + ", lastBlock: " + lastBlock);
}

//todo for core, saving results
checkForReorgs()
    .then(result => {
        console.log("checkForReorgs done ");
    })
    .catch(err => {
        console.log("Error in checkForReorgs: " + err);
    });

async function checkForReorgs() {
    console.log("checkForReorgs ");
    console.log("network:  " + network);
    let subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
        if (error)
            console.log("subscription error: " + error);
    })
        .on("data", async function (blockHeader) {
            console.log("new block: " + blockHeader.number);
            console.log("hash: " + blockHeader.hash);
            console.log("parentHash: " + blockHeader.parentHash);

            if (firstBlock === -1) {
                // in the begin
                firstBlock = lastBlock = blockHeader.number;
                blocks[lastBlock] = blockHeader;
                console.log("add first block: " + blockHeader.number);
            }
            else {

                if (blocks[blockHeader.number]) {
                    if (!isReorg) {
                        isReorg = true;
                        reorgToNumber = lastBlock;
                        console.log("!!!!Reorg TO: " + reorgToNumber);
                        console.log("-- reorg start" + blockHeader.number + ", from " + blocks[blockHeader.number].hash + " to " + blockHeader.hash);
                    }
                    if (blockHeader.number <= reorgToNumber) {
                        console.log("-- reorg " + blockHeader.number + ", from " + blocks[blockHeader.number].hash + " to " + blockHeader.hash);
                    }
                    console.log("-- reorg " + blockHeader.number + ", from " + blocks[blockHeader.number].hash + " to " + blockHeader.hash);

                    console.log("Reorg!! number: " + blockHeader.number);
                    console.log("Reorg new hash: " + blockHeader.hash + ", old hash: " + blocks[blockHeader.number].hash);
                    blocks[blockHeader.number] = blockHeader;
                }
                else {
                    if (blockHeader.number - lastBlock === 1) {
                        if (isReorg) {
                            if (checkIsSynced(reorgToNumber)) {
                                console.log("finished reorg: " + blockHeader.number);
                                isReorg = false;
                                reorgToNumber = -1;
                            }

                        }
                        addNextBlock(blockHeader);
                    } else if (blockHeader.number - lastBlock > 0) {
                        if (!isReorg) {
                            isReorg = true;
                            reorgToNumber = lastBlock;
                            console.log("!!!!Reorg TO: " + reorgToNumber);
                        }
                        console.log("!! got higher number then expected: " + blockHeader.number + " instead of " + lastBlock);
                        checkPreviousHashes(reorgToNumber);
                        blocks[blockHeader.number] = blockHeader;
                        console.log("add: " + blockHeader.number);
                        lastBlock = blockHeader.number;
                        removeFirst();
                    } else {
                        if (!isReorg) {
                            isReorg = true;
                            reorgToNumber = lastBlock;
                            console.log("!!!!Reorg TO: " + reorgToNumber);
                        }
                        console.log("!! insert in the middle: " + blockHeader.number);
                        blocks[blockHeader.number] = blockHeader;
                        console.log("add: " + blockHeader.number);
                        removeFirst()
                    }

                }
            }
            console.log("_____");
        });
}


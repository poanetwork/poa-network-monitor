const {
    getNetworkName,
    getWeb3,
} = require('./test-helper.js');
const web3 = getWeb3(true);
const network = getNetworkName();

let prevBlockNum;
let prevHash;

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
        .on("data", function (blockHeader) {
            console.log("new block: " + blockHeader.number);
            console.log("hash: " + blockHeader.hash);
            console.log("parentHash: " + blockHeader.parentHash);
            if (blockHeader.number !== prevBlockNum + 1) {
                console.log("different block number: " + " prevBlockNum: " + prevBlockNum + ", blockHeader.number: " + blockHeader.number);
            }
            prevBlockNum = blockHeader.number;
            if (blockHeader.parentHash !== prevHash) {
                console.log("!!! Reorgs: " + ", prevHash: " + prevHash + ", blockHeader.parentHash: " + blockHeader.parentHash);
            }
            prevHash = blockHeader.hash;
            console.log("_____");
        });
}


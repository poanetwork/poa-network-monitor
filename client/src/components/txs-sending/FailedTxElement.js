import React from "react";

function FailedTxElement(props) {
    return (
        <div>
            <div>transaction hash: {props.tx.transactionHash}</div>
            <div>block number: {props.tx.blockNumber}</div>
            <div>miner: {props.tx.miner}</div>
            <div>error message: {props.tx.errorMessage}</div>
            <br/>
        </div>
    );
}

export default FailedTxElement;
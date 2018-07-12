import React from "react";

function TxElement(props) {
    return (
        <div>
            <div>hash: {props.tx.hash}</div>
            <div>from: {props.tx.from}</div>
            <div>to: {props.tx.to}</div>
            <div>value: {props.tx.value}</div>
            <div>gasUsed: {props.tx.gasUsed}</div>
            <div>gasPrice: {props.tx.gasPrice}</div>
            <div>price: {props.tx.price}</div>
            <br/>
        </div>
    );
}

export default TxElement;
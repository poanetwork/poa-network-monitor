import React from "react";
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';
import TxElement from "../TxElement";

function TransferRewardRun(props) {
    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    let otherTxsLabel = props.run.otherTxs.length > 0 ? "Other transactions:" : "";
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.error}</td>
            <td>Validator: {props.run.validator} <br/>
                Payout key: {props.run.payoutKey}</td>
            <td>{props.run.blockNumber}</td>
            <td><strong>Transfer transaction:</strong>
                <TxElement tx={props.run.transferTx}/>
                <br/>
                <strong>{otherTxsLabel}</strong>
                {props.run.otherTxs.map(t => <TxElement tx={t}/>)
                }
            </td>
        </tr>
    );
}

export default TransferRewardRun;
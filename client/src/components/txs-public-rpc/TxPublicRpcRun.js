import React from "react";
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';

function TxPublicRpcRun(props) {
    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.errorMessage}</td>
            <td>{props.run.transactionHash}</td>
            <td>{props.run.blockNumber}</td>
            <td>{props.run.miner}</td>

        </tr>
    );
}

export default TxPublicRpcRun;
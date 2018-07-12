import React from "react";
import ArrayElement from "../ArrayElement"
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';
import FailedTxElement from "./FailedTxElement";

function MissingTxsRun(props) {
    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.lastBlock}</td>
            <td>
                {props.run.validatorsMissedTxs.map(v => <ArrayElement element={v}/>)
                }
            </td>
            <td>
                {props.run.failedTxs.map(t => <FailedTxElement tx={t}/>)
                }
            </td>
        </tr>
    );
}

export default MissingTxsRun;
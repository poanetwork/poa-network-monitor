import React from "react";
import ArrayElement from "../ArrayElement"
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';

function MissingRoundRun(props) {
    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.lastBlock}</td>
            <td>
                {props.run.missedValidators.map(c => <ArrayElement element={c}/>)
                }
            </td>
        </tr>
    );
}

export default MissingRoundRun;
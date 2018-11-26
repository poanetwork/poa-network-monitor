import React from "react";
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';
import ErrorElement from "../ErrorElement";

function RewardByBlockRun(props) {

    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.error.map(e => <ErrorElement error={e}/>)}</td>
            <td>Validator: {props.run.validator} <br/>
                Payout key: {props.run.payoutKey}</td>
            <td>{props.run.block}</td>
        </tr>
    );
}

export default RewardByBlockRun;
import React from "react";
import passedImg from '../../img/passed-icon.png';
import failedImg from '../../img/failed-icon.png';
import RewardDetails from "./RewardDetails";
import TxElement from "../TxElement";

function RewardRun(props) {
    let iconSrc = props.run.passed === 1 ? passedImg : failedImg;
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td><img className="passed-icon" src={iconSrc} alt="passed"/></td>
            <td>{props.run.error}</td>
            <td>
                {
                    <RewardDetails rewardDetails={props.run.rewardDetails}/>
                }
            </td>
            <td>
                {props.run.transactions.map(t => <TxElement tx={t}/>)
                }
            </td>
        </tr>
    );
}

export default RewardRun;
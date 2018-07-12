import React from "react";
import RewardRun from "./RewardRun";
import {Table} from 'reactstrap';

function RewardList(props) {
    console.log('props: ' + props);
    console.log('props j: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>Passed</th>
                <th>Error</th>
                <th>Reward details</th>
                <th>Transactions</th>
            </tr>
            </thead>
            <tbody>
            {props.rewardRuns.map(r => <RewardRun run={r}/>)}
            </tbody>
        </Table>
    );
}

export default RewardList;
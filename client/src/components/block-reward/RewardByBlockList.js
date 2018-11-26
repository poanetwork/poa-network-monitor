import React from "react";
import {Table} from 'reactstrap';
import RewardByBlockRun from "./RewardByBlockRun";

function RewardByBlockList(props) {
    console.log('props: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>Passed</th>
                <th>Error</th>
                <th>Validator</th>
                <th>Block</th>
            </tr>
            </thead>
            <tbody>
            {props.rewardByBlockRuns.map(r => <RewardByBlockRun run={r}/>)}
            </tbody>
        </Table>
    );
}

export default RewardByBlockList;
import React from "react";
import TransferRewardRun from "./TransferRewardRun";
import {Table} from 'reactstrap';

function TransferRewardList(props) {
    console.log('props: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>Passed</th>
                <th>Error</th>
                <th>Validator details</th>
                <th>From block number</th>
                <th>Transactions</th>
            </tr>
            </thead>
            <tbody>
            {props.transferRewardRuns.map(r => <TransferRewardRun run={r}/>)}
            </tbody>
        </Table>
    );
}

export default TransferRewardList;
import React from "react";
import MissingTxsRun from "./MissingTxsRun";
import {Table} from 'reactstrap';

function MissingTxsList(props) {
    console.log('props: ' + props);
    console.log('props j: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>Passed</th>
                <th>Last Block</th>
                <th>Validators who didn't mine txs in 5 rounds</th>
                <th>Failed txs</th>
            </tr>
            </thead>
            <tbody>
            {props.missingTxsRuns.map(r => <MissingTxsRun run={r}/>)}
            </tbody>
        </Table>
    );
}

export default MissingTxsList;
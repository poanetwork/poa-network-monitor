import React from "react";
import TxPublicRpcRun from "./TxPublicRpcRun";
import {Table} from 'reactstrap';

function TxsPublicRpcList(props) {
    console.log('props: ' + props);
    console.log('props j: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>Passed</th>
                <th>Error message</th>
                <th>Transaction hash</th>
                <th>Block number</th>
                <th>Validator</th>
            </tr>
            </thead>
            <tbody>
            {props.txsPublicRpcRuns.map(r => <TxPublicRpcRun run={r}/>)}
            </tbody>
        </Table>
    );
}

export default TxsPublicRpcList;
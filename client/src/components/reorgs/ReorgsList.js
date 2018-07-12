import React from "react";
import Reorg from "./Reorg";
import {Table} from 'reactstrap';

function ReorgsList(props) {
    console.log('props: ' + props);
    console.log('props j: ' + JSON.stringify(props));
    return (
        <Table bordered responsive striped>
            <thead>
            <tr>
                <th>Id</th>
                <th>Time</th>
                <th>To block</th>
                <th>Excluded blocks</th>
                <th>Accepted blocks</th>
            </tr>
            </thead>
            <tbody>
            {props.reorgs.map(r => <Reorg run={r}/>)}
            </tbody>
        </Table>
    );
}

export default ReorgsList;
import React, {Component} from 'react';
import MissingRoundRun from "./MissingRoundRun";
import {Table} from 'reactstrap';

class MissingRoundList extends Component {
    render() {
        return (
            <Table bordered responsive striped>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Time</th>
                    <th>Passed</th>
                    <th>Last Block</th>
                    <th>Missed validators</th>
                </tr>
                </thead>
                <tbody>
                {this.props.missingRoundsRuns.map(r => <MissingRoundRun run={r}/>)}
                </tbody>
            </Table>
        )
    }
}

export default MissingRoundList;
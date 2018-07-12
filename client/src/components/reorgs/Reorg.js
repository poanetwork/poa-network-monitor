import React from "react";
import BlockElement from "../BlockElement";

function Reorg(props) {
    console.log('Reorg props: ' + props);
    console.log('props j: ' + JSON.stringify(props));
    return (
        <tr>
            <th scope="row">{props.run.id}</th>
            <td>{props.run.time}</td>
            <td>{props.run.toBlock}</td>
            <td>
                {
                    props.run.changedBlocks.map(r => <BlockElement block={r.excluded}/>)
                }
            </td>
            <td>
                {
                    props.run.changedBlocks.map(t => <BlockElement block={t.accepted}/>)
                }
            </td>
        </tr>
    );
}

export default Reorg;
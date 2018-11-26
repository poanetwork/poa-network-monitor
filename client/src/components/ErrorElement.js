import React from "react";

function ErrorElement(props) {
    return (
        <div>
            <div>description: {props.error.description}</div>
            <div>expected: {props.error.expected}</div>
            <div>actual: {props.error.actual}</div>
            <br/>
        </div>
    );
}

export default ErrorElement;
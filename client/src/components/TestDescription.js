import React from "react";
import PropTypes from "prop-types";
import {Card, CardBody, CardTitle} from 'reactstrap';

function TestDescription(props) {
    return <Card>
        <CardBody>
            <CardTitle> <strong>{props.description}</strong></CardTitle>
        </CardBody>
    </Card>
}

TestDescription.propTypes = {description: PropTypes.string.isRequired};
export default TestDescription;

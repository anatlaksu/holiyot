import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
} from "reactstrap";
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';
import PropagateLoader from "react-spinners/PropagateLoader";
import StatisticsComponent from "./StatisticsComponent";

function StatisticsPage({ match }) {
    //spinner
    const [isdataloaded, setIsdataloaded] = useState(false);

    async function init() {
        setIsdataloaded(true);
       
    }

    useEffect(() => {
        init();
    }, [match])

    return (
        !isdataloaded ?
            <div style={{ width: '50%', marginTop: '30%' }}>
                <PropagateLoader color={'#ff4650'} loading={true} size={25} />
            </div>
            :
            <div>
                <StatisticsComponent />
                <Row>
                    <Col xs={12} md={3} style={{ textAlign: 'right' }}>
                    </Col>
                    <Col xs={12} md={6}>
                    </Col>
                    <Col xs={12} md={3}>
                    </Col>
                </Row>
            </div>
    );
}
export default withRouter(StatisticsPage);
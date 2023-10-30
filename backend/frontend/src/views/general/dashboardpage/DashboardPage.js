import React, { useState, useEffect, useRef } from "react";

import { useParams, Link, withRouter, Redirect } from "react-router-dom";

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
import axios from "axios";
import { signin, authenticate, isAuthenticated } from "auth/index";
import PropagateLoader from "react-spinners/PropagateLoader";

//redux
import { useSelector, useDispatch } from "react-redux";
import DashboardCard from "./dashboardCard";
import history from "../../../history";

function DashboardPage({ match, theme }) {
	//user
	const { user } = isAuthenticated();
	//spinner
	const [isdataloaded, setIsdataloaded] = useState(false);
	const [units, setUnits] = useState([]);
	const [reservevisits, setReservevisits] = useState({});
	//redux
	useEffect(() => {
	}, []);

	return (
		<h1>dashbord</h1>
	);

}

export default withRouter(DashboardPage);

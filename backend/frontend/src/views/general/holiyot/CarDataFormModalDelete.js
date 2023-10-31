import React, { useState, useEffect, useRef } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Container,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Alert,
	Spinner,
	Label,
	Col,
	Modal,
	ModalBody,
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { signin, authenticate, isAuthenticated } from "auth/index";
import { produce } from "immer";
import { generate } from "shortid";
import { toast } from "react-toastify";
import deletepic from "assets/img/delete.png";

const CarDataFormModalDelete = (props) => {
	const { user } = isAuthenticated();
	//cardata
	const [cardata, setCarData] = useState({});

	// const clickSubmit = (event) => {
	// 	DeleteCarDatasUnits();
	// };

	// async function DeleteCarDatasUnits() {
	// 	//delete cardata units
	// 	var tempcardataid = props.cardataid;
	// 	let tempcardata = { ...cardata };
	// 	let result = await axios.put(
	// 		`http://localhost:8000/api/reservevisits/remove/${tempcardataid}`
	// 	);

	// 	toast.success(`איש מילואים נמחק בהצלחה`);
	// 	props.ToggleForModal();
	// }

	// function init() {}

	// useEffect(() => {
	// 	init();
	// }, [props.isOpen]);

	return (
		null
		// <Modal
		// 	style={{
		// 		minHeight: "100%",
		// 		maxHeight: "100%",
		// 		minWidth: "80%",
		// 		maxWidth: "80%",
		// 		justifyContent: "center",
		// 		alignSelf: "center",
		// 		margin: "0px",
		// 		margin: "auto",
		// 		direction: "rtl",
		// 	}}
		// 	isOpen={props.isOpen}
		// 	centered
		// 	fullscreen
		// 	scrollable
		// 	size=""
		// 	toggle={props.Toggle}
		// >
		// 	<ModalBody>
		// 		<Card>
		// 			<CardHeader style={{ direction: "rtl" }}>
		// 				<CardTitle
		// 					tag="h4"
		// 					style={{
		// 						direction: "rtl",
		// 						textAlign: "center",
		// 						fontWeight: "bold",
		// 					}}
		// 				>
		// 					מחיקת כלי מהיחידה
		// 				</CardTitle>
		// 				{/*headline*/}
		// 			</CardHeader>
		// 			<CardBody style={{ direction: "rtl" }}>
		// 				<Container>
		// 					<div style={{ textAlign: "center", paddingTop: "20px" }}>
		// 						<h3>האם אתה בטוח שברצונך למחוק את האיש מילואים?</h3>
		// 						<div style={{ textAlign: "center", paddingTop: "20px" }}>
		// 							<button className="btn-new-delete" onClick={clickSubmit}>
		// 								מחק
		// 							</button>
		// 						</div>
		// 					</div>
		// 				</Container>
		// 			</CardBody>
		// 		</Card>
		// 	</ModalBody>
		// </Modal>
	);
};
export default withRouter(CarDataFormModalDelete);

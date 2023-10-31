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
	ButtonGroup,
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { signin, authenticate, isAuthenticated } from "auth/index";
import { produce } from "immer";
import { generate } from "shortid";
import { toast } from "react-toastify";
import Select from "components/general/Select/AnimatedSelect";
import deletepic from "assets/img/delete.png";

const CarDataFormModal = (props) => {
	const { user } = isAuthenticated();
	//cardata
	const [cardata, setCarData] = useState({});

	const [units, setUnits] = useState([]);

	const [mails, setmailsarray] = useState([]);


	const loadcardata = async () => {
		await axios
			.get(`http://localhost:8000/api/reservevisits/${props.cardataid}`)
			.then(async (response) => {
				let tempcardata = response.data[0];
				setCarData(tempcardata);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	function handleChange(evt) {
		const value = evt.target.value;
		setCarData({ ...cardata, [evt.target.name]: value });
	}

	function getUnits() {
		axios
			.get(`http://localhost:8000/api/units`)
			.then((res) => {
				setUnits(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function handleChange2(selectedOption, name) {
		if (!(selectedOption.value == "בחר"))
			setCarData({ ...cardata, [name]: selectedOption.value });
		else {
			setCarData({ ...cardata, [name]: "" });
		}
	}

	const clickSubmit = (event) => {
		CheckFormData();
	};

	const CheckFormData = () => {
		//check for stuff isnt empty
		var flag = true;
		var ErrorReason = "";

		if (cardata.name == "") {
			flag = false;
			ErrorReason += " שם ריק \n";
		}
		if (cardata.family == "") {
			flag = false;
			ErrorReason += " שם משפחה ריק \n";
		}
		if (cardata.pesonal_number == "") {
			flag = false;
			ErrorReason += "  מספר אישי ריק \n";
		}
		if (
			document.getElementById("selta").options[
				document.getElementById("selta").selectedIndex
			].value == "בחר"
		) {
			flag = false;
			ErrorReason += " סוג תא ריק \n";
		}

		if (flag == true) {
			Create();
		} else {
			toast.error(ErrorReason);
		}
	};

	async function Create() {
		let tempramam = { ...cardata };
		let result = await axios.post(
			`http://localhost:8000/api/report`,
			tempramam
		);
		toast.success(`בקשה לחוליה נוסף בהצלחה`);
		props.ToggleForModal();
	}

	// async function Update() {
	// 	//update ramam
	// 	var tempramamid = props.cardataid;
	// 	let tempramam = { ...cardata };
	// 	let result = await axios.put(
	// 		`http://localhost:8000/api/reservevisits/${tempramamid}`,
	// 		tempramam
	// 	);
	// 	toast.success(`איש מילואים עודכן בהצלחה`);
	// 	props.ToggleForModal();
	// }


	function init() {
		if (props.cardataid != undefined) {
			loadcardata();
		}
	}

	useEffect(() => {
		if (props.isOpen == true) {
			getUnits();
			init();
		} else {
			setCarData({});
		}
	}, [props.isOpen]);

	return (
		<>
			<Modal
				style={{
					minHeight: "100%",
					maxHeight: "100%",
					minWidth: "80%",
					maxWidth: "80%",
					justifyContent: "center",
					alignSelf: "center",
					marginTop: "auto",
					direction: "rtl",
				}}
				isOpen={props.isOpen}
				centered
				fullscreen
				scrollable
				size=""
				toggle={props.Toggle}
			>
				<ModalBody>
					<Card>
						<CardHeader style={{ direction: "rtl" }}>
							<CardTitle
								tag="h4"
								style={{
									direction: "rtl",
									textAlign: "center",
									fontWeight: "bold",
								}}
							>
								טופס  בקשת חוליה
							</CardTitle>
							{/*headline*/}
						</CardHeader>
						<CardBody style={{ direction: "rtl" }}>
							<Container>
								<Row>
								<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>מרחב</h6>

										<Select
											data={units}
											handleChange2={handleChange2}
											name="unit"
											val={cardata.merhav}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>גוף דורש</h6>
										<Input
											placeholder="גוף דורש"
											type="select"
											name="body_requires"
											value={cardata.body_requires}
											onChange={handleChange}
											id="selbody"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={'פצ"ן'}>{'פצ"ן'}</option>
											<option value={'פד"ם'}>{'פד"ם'}</option>
											<option value={'פקמ"ז'}>{'פקמ"ז'}</option>
											<option value={'פקע"ר'}>{'פקע"ר'}</option>
											<option value={'הובלה'}>{'הובלה'}</option>
											<option value={'חט"ל'}>{'חט"ל'}</option>
											<option value={'רפ"ט'}>{'רפ"ט'}</option>
											<option value={'מש"א'}>{'מש"א'}</option>
										</Input>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>יחידה דורשת</h6>
										<Input
											placeholder="יחידה דורשת"
											type="string"
											name="unit_requires"
											value={cardata.unit_requires}
											onChange={handleChange}
										/>
									</Col>
								</Row>
								<Row>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>סוג כיתה</h6>
										<Input
											placeholder="סוג כיתה"
											type="string"
											name="class"
											value={cardata.class}
											onChange={handleChange}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>כמות כיתות</h6>
										<Input
											placeholder="כמות כיתות"
											type="number"
											name="number_class"
											value={cardata.number_class}
											onChange={handleChange}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>מקור החוליה</h6>
										<Input
											placeholder="מקור החוליה"
											type="select"
											name="source_holi"
											value={cardata.source_holi}
											onChange={handleChange}
											id="selholi"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={'טנ"א ארצי'}>{'טנ"א ארצי'}</option>
											<option value={'חט"ל'}>{'חט"ל'}</option>
											<option value={'רפ"ט'}>{'רפ"ט'}</option>
											<option value={'מש"א'}>{'מש"א'}</option>
											<option value={"אגד"}>{"אגד"}</option>
											<option value={"תעשייה"}>{"תעשייה"}</option>
										</Input>
									</Col>
								</Row>
								<Row>
								<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>מהות התקלה</h6>
										<Input
											placeholder="מהות התקלה"
											type="string"
											name="what_happend"
											value={cardata.what_happend}
											onChange={handleChange}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>צ'</h6>
										<Input
											placeholder="צ'"
											type="string"
											name="zadik"
											value={cardata.zadik}
											onChange={handleChange}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>אל מרחב</h6>
										<Input
											placeholder="אל מרחב"
											type="select"
											name="to_merhav"
											value={cardata.to_merhav}
											onChange={handleChange}
											id="selmerhav"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={'פצ"ן'}>{'פצ"ן'}</option>
											<option value={'פד"ם'}>{'פד"ם'}</option>
											<option value={'פקמ"ז'}>{'פקמ"ז'}</option>
											<option value={'פקע"ר'}>{'פקע"ר'}</option>
											<option value={'הובלה'}>{'הובלה'}</option>
											<option value={'חט"ל'}>{'חט"ל'}</option>
											<option value={'רפ"ט'}>{'רפ"ט'}</option>
											<option value={'מש"א'}>{'מש"א'}</option>
										</Input>
									</Col>
								</Row>
								<Row>
								<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>מיקום נדרש</h6>
										<Input
											placeholder="מיקום נדרש"
											type="string"
											name="mikom"
											value={cardata.mikom}
											onChange={handleChange}
										/>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>תאריך נדרש לחוליה</h6>
										<Input
											placeholder="תאריך נדרש לחוליה"
											type="date"
											name="date_need"
											value={cardata.date_need}
											onChange={handleChange}
										/>
									</Col>
									<Col></Col>
								</Row>
								<Row>
								<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>תדרוך אל"ם</h6>
										<Input
											placeholder='תדרוך אל"ם'
											type="select"
											name="alm"
											value={cardata.alm}
											onChange={handleChange}
											id="selalm"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={true}>{'כן'}</option>
											<option value={false}>{'לא'}</option>
										</Input>
									</Col>
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>אישור פיקוד</h6>
										<Input
											placeholder='אישור פיקוד'
											type="select"
											name="pikod"
											value={cardata.pikod}
											onChange={handleChange}
											id="selpikod"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={true}>{'כן'}</option>
											<option value={false}>{'לא'}</option>
										</Input>
									</Col>									
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>אישור השולחן</h6>
										<Input
											placeholder='אישור השולחן'
											type="select"
											name="table"
											value={cardata.table}
											onChange={handleChange}
											id="seltable"
										>
											<option value={"בחר"}>{"בחר"}</option>
											<option value={true}>{'כן'}</option>
											<option value={false}>{'לא'}</option>
										</Input>
									</Col>																		
								</Row>
								<Row>
								<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>שם איש קשר</h6>
										<Input
											placeholder="שם איש קשר"
											type="string"
											name="namecontact"
											value={cardata.namecontact}
											onChange={handleChange}
										/>
									</Col>	
									<Col
										style={{
											justifyContent: "right",
											alignContent: "right",
											textAlign: "right",
										}}
									>
										<h6 style={{}}>טלפון איש קשר</h6>
										<Input
											placeholder="טלפון איש קשר"
											type="string"
											name="numbercontact"
											value={cardata.numbercontact}
											onChange={handleChange}
										/>
									</Col>							
									<Col></Col>
								</Row>
								{mails.length == 0 ? (
													<Row>
														<Col
															style={{ display: "flex", textAlign: "right" }}
														>
															<Button
																style={{ width: "100px", padding: "5px" }}
																type="button"
																onClick={() => {
																	setmailsarray((currentSpec) => [
																		...currentSpec,
																		{ id: generate() },
																	]);
																}}
															>
																הוסף מייל
															</Button>
														</Col>
													</Row>
												) : (
													mails.map((p, index) => {
														return (
															<div>
																{index == 0 ? (
																	<Row>
																		<Col
																			style={{
																				display: "flex",
																				textAlign: "right",
																			}}
																		>
																			<Button
																				style={{
																					width: "100px",
																					padding: "5px",
																				}}
																				type="button"
																				onClick={() => {
																					setmailsarray((currentSpec) => [
																						...currentSpec,
																						{ id: generate() },
																					]);
																				}}
																			>
																				 הוסף מייל
																			</Button>
																		</Col>
																	</Row>
																) : null}
																{
																	<Row>
																		<Col
																			xs={12}
																			md={4}
																		>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					  מייל לשליחה
																				</p>
																				<Input
																					onChange={(e) => {
																						const mail = e.target.value;
																						if (e.target.value != "")
																							setmailsarray((currentSpec) =>
																								produce(currentSpec, (v) => {
																									v[index].mail =
																									mail;
																								})
																							);
																					}}
																					placeholder="מייל"
																					value={p.mail}
																					type="string"
																				/>
																			</div>
																		</Col>
																	</Row>
																}
																<Button
																	type="button"
																	onClick={() => {
																		setmailsarray((currentSpec) =>
																			currentSpec.filter((x) => x.id !== p.id)
																		);
																	}}
																>
																	<img
																		src={deletepic}
																		height="20px"
																	></img>
																</Button>
															</div>
														);
													})
												)}


								<div style={{ textAlign: "center", paddingTop: "20px" }}>
									<button className="btn" onClick={clickSubmit}>
										שלח
									</button>
								</div>
							</Container>
						</CardBody>
					</Card>
				</ModalBody>
			</Modal>
		</>
	);
};
export default withRouter(CarDataFormModal);

import React, { useState, useEffect, useRef } from "react";

import { Link, withRouter, Redirect } from "react-router-dom";
import {
	buildStyles,
	CircularProgressbar,
	CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";

// reactstrap components
import {
	Button,
	ButtonGroup,
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	CardTitle,
	Row,
	Container,
	Col,
	Collapse,
	Progress,
} from "reactstrap";

function DashboardCard(props) {
	const [collapseOpen, setcollapseOpen] = useState(false);
	const [processedData, setProcessedData] = useState({
		todayPresent: 0,
		dailSent: 0,
		shamapOpen: 0,
		present: 0,
	});
	const [color, setColor] = useState();

	const titles = useRef({
		todayPresent: 0,
		dailSent: 0,
		shamapOpen: 0,
		present: 0,
	});

	function init() {
		let tmp_true = {
			present: [],
			todayPresent: [],
			dailSent: [],
			shamapOpen: [],
		};
		let tmp_false = {
			present: [],
			todayPresent: [],
			dailSent: [],
			shamapOpen: [],
		};
		let tmp = { todayPresent: 0, dailSent: 0, shamapOpen: 0, present: 0 };
		function tmp_push(val, key) {
			if (val) {
				tmp_true[key].push(val);
			} else {
				tmp_false[key].push(val);
			}
		}
		props.data.map((dt) => {
			tmp_push(dt.present, "present");
			tmp_push(dt.todayPresent, "todayPresent");
			tmp_push(dt.dailSent, "dailSent");
			tmp_push(dt.shamapOpen, "shamapOpen");
		});
		Object.keys(tmp_true).map((key) => {
			tmp[key] = ~~((tmp_true[key].length / props.data.length) * 100);
			titles.current[key] = tmp_true[key].length;
		});
		// console.log(props.data);
		// console.log(tmp_true);
		// console.log(tmp_false);
		// console.log(tmp);
		// console.log(tmp.todayPresent);
		if (tmp.todayPresent < 60) {
			setColor("#ff2128");
		}
		if (tmp.todayPresent > 60 && tmp.todayPresent < 80) {
			setColor("#ffca3a");
		}
		if (tmp.todayPresent > 80 && tmp.todayPresent <= 100) {
			setColor("#8ac926");
		}
		setProcessedData(tmp);
	}

	const toggleCollapse = (event) => {
		setcollapseOpen(!collapseOpen);
	};

	useEffect(() => {
		init();
	}, [props]);

	return (
		<Col xs={12} md={3}>
			<Card style={{ boxShadow: "rgb(123 123 123 / 20%) 0px 2px 5px 5px" }}>
				<CardHeader style={{ padding: "0px" }}>
					<div style={{ textAlign: "right" }}>
						<h3
							style={{
								textAlign: "center",
								fontWeight: "bold",
								marginTop: "0px",
								marginBottom: "0px",
							}}
						>
							התייצבות יומית {props.unit}
						</h3>
					</div>
				</CardHeader>
				<CardBody
					style={{ textAlign: "center", margin: "auto", cursor: "pointer" }}
					onClick={(e) => toggleCollapse(e)}
				>
					<div
						style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
					>
						<ProgressProvider
							valueStart={0}
							valueEnd={props.data != 0 ? processedData.todayPresent : 0}
						>
							{(value) => (
								<CircularProgressbarWithChildren
									value={value}
									/*text={`${value}%`}*/ styles={{
										root: {},
										path: {
											stroke: color,

											strokeLinecap: "butt",
											transition: "stroke-dashoffset 0.5s ease 0s",
										},
										trail: {
											stroke: "rgb(141 141 141 / 30%)",
											strokeLinecap: "butt",
											transform: "rotate(0.25turn)",
											transformOrigin: "center center",
										},
										text: {
											fill: color,
											fontSize: "18px",
										},
										background: {
											fill: "#3e98c7",
										},
									}}
								>
									<div>
										<h2 style={{ margin: "0px" }}>{`${value.toFixed(0)}%`}</h2>
									</div>
									<div style={{ fontSize: 12, marginTop: -2 }}>
										<h5 style={{ margin: "0px" }}>
											{titles.current.todayPresent + "/" + props.data.length}
										</h5>
									</div>
								</CircularProgressbarWithChildren>
							)}
						</ProgressProvider>
					</div>
					{collapseOpen ? (
						<div
							style={{
								width: "80%",
								marginLeft: "auto",
								marginRight: "auto",
								paddingTop: "25px",
							}}
						>
							{/* //* חייגן   */}
							<h6>נשלח חייגן: {titles.current.dailSent} </h6>
							<Progress
								color="guyblue"
								value={processedData.dailSent ? processedData.dailSent : 0}
								style={{ height: "10px", marginBottom: "8px" }}
							>
								{processedData.dailSent ? processedData.dailSent : 0}%
							</Progress>
							{/* //* התייצבות   */}
							<h6> התייצבות: {titles.current.present} </h6>
							<Progress
								color="guyblue"
								value={processedData.present ? processedData.present : 0}
								style={{ height: "10px", marginBottom: "8px" }}
							>
								{processedData.present ? processedData.present : 0}%
							</Progress>
							{/* //* שמפ   */}
							<h6>נפתח שמפ: {titles.current.shamapOpen} </h6>
							<Progress
								color="guyblue"
								value={processedData.shamapOpen ? processedData.shamapOpen : 0}
								style={{ height: "10px", marginBottom: "8px" }}
							>
								{processedData.shamapOpen ? processedData.shamapOpen : 0}%
							</Progress>
						</div>
					) : null}
				</CardBody>
			</Card>
		</Col>
	);
}

export default withRouter(DashboardCard);

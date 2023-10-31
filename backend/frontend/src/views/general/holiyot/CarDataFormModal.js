import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
// reactstrap components
import deletepic from "assets/img/delete.png";
import { authenticate, isAuthenticated, signin } from "auth/index";
import axios from "axios";
import Select from "components/general/Select/AnimatedSelect";
import history from "history.js";
import { produce } from "immer";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  Row,
  Spinner,
} from "reactstrap";
import { generate } from "shortid";

const CarDataFormModal = (props) => {
  const { user } = isAuthenticated();
  //cardata
  const [cardata, setCarData] = useState({});

  const [units, setUnits] = useState([]);

  const [mails, setmailsarray] = useState([`${user.personalnumber}@outlook.com`]);

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

    if (cardata.unit_requires == "" || cardata.unit_requires === undefined) {
      flag = false;
      ErrorReason += " יחידה דורשת ריקה \n";
    }
    if (cardata.amlah == "" || cardata.amlah === undefined) {
      flag = false;
      ErrorReason += " סוג אמלח ריק \n";
    }
	if (
		document.getElementById("selamlah").options[
		  document.getElementById("selamlah").selectedIndex
		].value == "בחר"
	  ) {
		flag = false;
		ErrorReason += " מרחב אמלח ריק \n";
	  }
  
    if (cardata.mikom == "" || cardata.mikom === undefined) {
      flag = false;
      ErrorReason += "  מיקום אמלח ריק \n";
    }
	if (cardata.what_happend == "" || cardata.what_happend === undefined) {
		flag = false;
		ErrorReason += "  מהות התקלה ריק \n";
	  }
  
    if (
      document.getElementById("selhappend").options[
        document.getElementById("selhappend").selectedIndex
      ].value == "בחר"
    ) {
      flag = false;
      ErrorReason += " סוג התקלה ריק \n";
    }
	if (cardata.class == "" || cardata.class === undefined) {
		flag = false;
		ErrorReason += "  סוג הכיתה ריק \n";
	  }
	  if (cardata.number_class == "" || cardata.number_class === undefined) {
		flag = false;
		ErrorReason += "  מספר הכיתות ריק \n";
	  }
	  if (
		document.getElementById("selholi").options[
		  document.getElementById("selholi").selectedIndex
		].value == "בחר"
	  ) {
		flag = false;
		ErrorReason += " מקור החוליה ריק \n";
	  }
	  if (!cardata.date_need) {
		flag = false;
		ErrorReason += " ,תאריך ריק \n";
	}
	if (cardata.namecontact == "" || cardata.namecontact === undefined) {
		flag = false;
		ErrorReason += "  שם נציג ריק \n";
	  }
	  if (cardata.numbercontact == "" || cardata.numbercontact === undefined) {
		flag = false;
		ErrorReason += "  טלפון נציג ריק \n";
	  }
	  if (mails.length == 0
		) {
			flag = false;
			ErrorReason += " ,לא הוזן כתובת מייל\n";
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
      init();
	  getUnits();
    } else {
      setmailsarray([`${user.personalnumber}@outlook.com`]);
      setCarData({number_class:1,type_happend:"לא משבית",date_need:(new Date()).toISOString().split("T")[0],mail:[`${user.personalnumber}@outlook.com`]});
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
                טופס בקשת חוליה
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
                    <h6 style={{}}>גוף דורש</h6>

                    <Select
                      data={units}
                      handleChange2={handleChange2}
                      name="unit"
                      val={cardata.body_requires}
                    />
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
                    <h6 style={{}}>סוג האמל"ח</h6>
                    <Input
                      placeholder='סוג האמל"ח'
                      type="string"
                      name="amlah"
                      value={cardata.amlah}
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
                    <h6 style={{}}>מרחב האמל"ח</h6>
                    <Input
                      placeholder='מרחב האמל"ח'
                      type="select"
                      name="merhav_amlah"
                      value={cardata.merhav_amlah}
                      onChange={handleChange}
                      id="selamlah"
                    >
                      <option value={"בחר"}>{"בחר"}</option>
                      <option value={"צפון"}>{"צפון"}</option>
                      <option value={"דרום"}>{"דרום"}</option>
					  <option value={"מרכז"}>{"מרכז"}</option>
                    </Input>
                  </Col>
				  <Col
                    style={{
                      justifyContent: "right",
                      alignContent: "right",
                      textAlign: "right",
                    }}
                  >
                    <h6 style={{}}>מיקום האמל"ח</h6>
                    <Input
                      placeholder='מיקום האמל"ח'
                      type="string"
                      name="mikom"
                      value={cardata.mikom}
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
                    <h6 style={{}}>סוג התקלה</h6>
                    <Input
                      placeholder='סוג התקלה'
                      type="select"
                      name="type_happend"
                      value={cardata.type_happend}
                      onChange={handleChange}
                      id="selhappend"
                    >
                      <option value={"בחר"}>{"בחר"}</option>
                      <option value={"משבית"}>{"משבית"}</option>
                      <option value={"לא משבית"}>{"לא משבית"}</option>
                    </Input>
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
					  min={1}
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
                      <option value={'אגד טנ"א ארצי'}>{'אגד טנ"א ארצי'}</option>
                      <option value={'חט"ל'}>{'חט"ל'}</option>
                      <option value={'רפ"ט'}>{'רפ"ט'}</option>
                      <option value={'מש"א'}>{'מש"א'}</option>
                      <option value={"תעשייה"}>{"תעשייה"}</option>
                    </Input>
                  </Col>
				  <Col
                    style={{
                      justifyContent: "right",
                      alignContent: "right",
                      textAlign: "right",
                    }}
                  >
                    <h6 style={{}}>מועד רצוי להוצאת החוליה</h6>
                    <Input
                      placeholder="מועד רצוי להוצאת החוליה"
                      type="date"
					  min={(new Date()).toISOString().split("T")[0]}
                      name="date_need"
                      value={cardata.date_need}
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
                      type="tel"
                      name="numbercontact"
                      value={cardata.numbercontact}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                {mails.length == 0 ? (
                  <Row>
                    <Col style={{ display: "flex", textAlign: "right" }}>
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
                            <Col xs={12} md={4}>
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
                                    setmailsarray((currentSpec) =>
                                      produce(currentSpec, (v) => {
                                        v[index].mail = mail;
                                      })
                                    );
                                  }}
                                  placeholder="מייל"
                                  value={p.mail}
                                  type="email"
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
                          <img src={deletepic} height="20px"></img>
                        </Button>
                      </div>
                    );
                  })
                )}
				<div 
				 tag="h4"
                style={{
                  direction: "rtl",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                  תיאומים אגמיים
</div>
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
                      <option value={true}>{"כן"}</option>
                      <option value={false}>{"לא"}</option>
                    </Input>
                  </Col>
                  <Col
                    style={{
                      justifyContent: "right",
                      alignContent: "right",
                      textAlign: "right",
                    }}
                  >
                    <h6 style={{}}>אישור מול הפיקוד</h6>
                    <Input
                      placeholder="אישור מול הפיקוד"
                      type="select"
                      name="pikod"
                      value={cardata.pikod}
                      onChange={handleChange}
                      id="selpikod"
                    >
                      <option value={"בחר"}>{"בחר"}</option>
                      <option value={true}>{"כן"}</option>
                      <option value={false}>{"לא"}</option>
                    </Input>
                  </Col>
                  <Col
                    style={{
                      justifyContent: "right",
                      alignContent: "right",
                      textAlign: "right",
                    }}
                  >
                    <h6 style={{}}>אישור צירי נסיעה</h6>
                    <Input
                      placeholder="אישור צירי נסיעה"
                      type="select"
                      name="road"
                      value={cardata.road}
                      onChange={handleChange}
                      id="selroad"
                    >
                      <option value={"בחר"}>{"בחר"}</option>
                      <option value={true}>{"כן"}</option>
                      <option value={false}>{"לא"}</option>
                    </Input>
                  </Col>
                </Row>

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

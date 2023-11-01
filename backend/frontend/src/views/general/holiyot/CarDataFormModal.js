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
  const [msdArray, setMSDArray] = useState([]);

  const [units, setUnits] = useState([]);

  const [mails, setmailsarray] = useState([
    { mail: `${user.personalnumber}@outlook.com` },
  ]);

  const [email, setEmail] = useState([]);// לתוך email להכניס את המיילים של האנשים ששמרו פרוייקט זה כמועדף

  const loadcardata = async () => {
    await axios
      .get(`http://localhost:8000/api/report/${props.cardataid}`)
      .then(async (response) => {
        let tempcardata = response.data[0];
        setCarData(tempcardata);
        setmailsarray(tempcardata.mail);
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
      // .get(`http://localhost:8000/api/units/`)
      .get(`http://localhost:8000/api/units/${user.unit}`)
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
    var ErrorReason = [];

    if (cardata.body_requires == "" || cardata.body_requires === undefined) {
      flag = false;
      ErrorReason.push(" גוף דורש ריק");
    }

    if (cardata.unit_requires == "" || cardata.unit_requires === undefined) {
      flag = false;
      ErrorReason.push(" יחידה דורשת ריקה");
    }
    if (cardata.amlah == "" || cardata.amlah === undefined) {
      flag = false;
      ErrorReason.push(" סוג אמלח ריק ");
    }
    if (
      document.getElementById("selamlah").options[
        document.getElementById("selamlah").selectedIndex
      ].value == "בחר"
    ) {
      flag = false;
      ErrorReason.push(" מרחב אמלח ריק ");
    }

    if (cardata.mikom == "" || cardata.mikom === undefined) {
      flag = false;
      ErrorReason.push("  מיקום אמלח ריק ");
    }
    if (cardata.what_happend == "" || cardata.what_happend === undefined) {
      flag = false;
      ErrorReason.push("  מהות התקלה ריק ");
    }

    if (
      document.getElementById("selhappend").options[
        document.getElementById("selhappend").selectedIndex
      ].value == "בחר"
    ) {
      flag = false;
      ErrorReason.push(" סוג התקלה ריק ");
    }
    if (cardata.class == "" || cardata.class === undefined) {
      flag = false;
      ErrorReason.push("  סוג הכיתה ריק ");
    }
    if (cardata.number_class == "" || cardata.number_class === undefined) {
      flag = false;
      ErrorReason.push("  מספר הכיתות ריק ");
    }
    if (
      document.getElementById("selholi").options[
        document.getElementById("selholi").selectedIndex
      ].value == "בחר"
    ) {
      flag = false;
      ErrorReason.push(" מקור החוליה ריק ");
    }
    if (!cardata.date_need) {
      flag = false;
      ErrorReason.push(" תאריך ריק ");
    }
    if (cardata.namecontact == "" || cardata.namecontact === undefined) {
      flag = false;
      ErrorReason.push("  שם נציג ריק ");
    }
    if (cardata.numbercontact == "" || cardata.numbercontact === undefined) {
      flag = false;
      ErrorReason.push("  טלפון נציג ריק ");
    }
    if (mails.length == 0) {
      flag = false;
      ErrorReason.push(" לא הוזן כתובת מייל");
    }

    if (user.role == "3" && cardata.status == "אושר") {
      if (!cardata.date_arrival) {
        flag = false;
        ErrorReason.push(" תאריך הגעה ליעד ריק ");
      }
      if (!cardata.date_start) {
        flag = false;
        ErrorReason.push(" תאריך התחלת המשימה ריק ");
      }
      if (!cardata.date_end) {
        flag = false;
        ErrorReason.push(" תאריך סיום המשימה ריק ");
      }
      if (!cardata.date_return) {
        flag = false;
        ErrorReason.push(" תאריך הגעה ליחידת האם ריק ");
      }
      if (cardata.holi_group == "" || cardata.holi_group === undefined) {
        flag = false;
        ErrorReason.push(" חברי החוליה ריק ");
      }
      if (cardata.note == "" || cardata.note === undefined) {
        flag = false;
        ErrorReason.push("הערות ריק ");
      }
    }

    if (flag == true) {
      if (
        (user.role == "2" && cardata.status == "חדש") ||
        (user.role == "0" && cardata.status == 'ממתין לאישור מכלול טנ"א') ||
        (user.role == "3" && cardata.status == "אושר")
      ) {
        Update();
        sendEmail();
      } else {
        Create();
      }
    } else {
      ErrorReason.forEach((e) => {
        toast.error(e);
      });
    }
  };

  const makemsd = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  // const msdExcist = (msd) => {
  //   axios
  //     .get(`http://localhost:8000/api/report/findmsd/${msd}`)
  //     .then(async (response) => {
  //       if (response.data.length > 0) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  async function Create() {
    let msd = makemsd(6);
    while (msdArray.includes(msd)) {
      msd = makemsd(6);
    }
    let tempramam = { ...cardata, mail: mails, status: "חדש", msd: msd };
    let result = await axios.post(
      `http://localhost:8000/api/report`,
      tempramam
    );
    toast.success(`בקשה לחוליה נוסף בהצלחה`);
    props.ToggleForModal();
  }

  async function Update() {
    //update ramam
    var tempramamid = props.cardataid;
    let tempramam;
    let date_kshirot_tne = "";
    let date_matcal_tne = "";
    if (user.role == "2" && cardata.status == "חדש") {
      date_kshirot_tne = new Date().toISOString();
    }
    if (user.role == "0" && cardata.status == 'ממתין לאישור מכלול טנ"א') {
      date_matcal_tne = new Date().toISOString();
    }
    if (user.role == "2" && cardata.status == "חדש") {
      if (
        document.getElementById("selkshirot_tne").options[
          document.getElementById("selkshirot_tne").selectedIndex
        ].value == "true"
      ) {
        tempramam = {
          ...cardata,
          mail: mails,
          status: 'ממתין לאישור מכלול טנ"א',
          date_kshirot_tne: date_kshirot_tne,
          // date_matcal_tne: date_matcal_tne,
        };
      }
      if (
        document.getElementById("selkshirot_tne").options[
          document.getElementById("selkshirot_tne").selectedIndex
        ].value == "false"
      ) {
        tempramam = { ...cardata, mail: mails, status: "נדחה" };
      }
    }
    if (user.role == "0" && cardata.status == 'ממתין לאישור מכלול טנ"א') {
      if (
        document.getElementById("selmatcal_tne").options[
          document.getElementById("selmatcal_tne").selectedIndex
        ].value == "true"
      ) {
        tempramam = {
          ...cardata,
          mail: mails,
          status: "אושר",
          // date_kshirot_tne: date_kshirot_tne,
          date_matcal_tne: date_matcal_tne,
        };
      }
      if (
        document.getElementById("selmatcal_tne").options[
          document.getElementById("selmatcal_tne").selectedIndex
        ].value == "false"
      ) {
        tempramam = { ...cardata, mail: mails, status: "נדחה" };
      }
    }
    if (user.role == "3") {
      tempramam = { ...cardata, mail: mails };
    }

    axios
      .post(`http://localhost:8000/api/report/update/${tempramamid}`, tempramam)
      .then((response) => {
        // window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
      });
    toast.success(`בקשה לחוליה עודכן בהצלחה`);
    props.ToggleForModal();
  }

  const sendEmail = async () => {

    const ma= mails.map((mail)=>mail.mail);
    console.log(ma);
    setEmail(ma);

    console.log(email);

    const datae = {
      email,
    };

    const response = await axios.post(
      "http://localhost:8000/api/sendemail",
      email
    );
    console.log(response.data);
  };


  function init() {
    if (props.cardataid != undefined) {
      loadcardata();
    }
  }

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/report/`)
      .then(async (response) => {
        response.data.forEach((element) => {
          msdArray.push(element.msd);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    if (props.isOpen == true) {
      init();

      getUnits();
    } else {
      setmailsarray([{ mail: `${user.personalnumber}@outlook.com` }]);
      setCarData({
        number_class: 1,
        type_happend: "לא משבית",
        date_need: new Date().toISOString().split("T")[0],
        body_requires: user.unit,
      });
    }
  }, [props.isOpen]);

  const getColorStatus = () => {
    if (cardata.status == "חדש") return "blue";
    else if (cardata.status == 'ממתין לאישור  תחום כשירות מסגרות הטנ"א')
      return "yellow";
    else if (cardata.status == 'ממתין לאישור מכלול טנ"א') return "green";
    else if (cardata.status == "נדחה") return "red";
    else return "black";
  };

  const getIfDisabled = () => {
    if (
      user.role == "1" &&
      (cardata.status == "חדש" || cardata.status == undefined)
    )
      return false;
    else if (user.role == "2" || user.role == "0") return false;
    else if (
      user.role == "3" ||
      cardata.status == "חדש" ||
      cardata.status == undefined
    )
      return false;
    else return true;
  };
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
              {cardata.status && (
                <CardTitle
                  tag="h5"
                  style={{
                    direction: "rtl",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: getColorStatus(),
                  }}
                >
                  סטוטס הבקשה: {cardata.status}
                </CardTitle>
              )}
              {/*headline*/}
            </CardHeader>
            <CardBody style={{ direction: "rtl" }}>
              <Container>
                <FormGroup>
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
                        name="body_requires"
                        val={cardata.body_requires}
                        isDisabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
                      />
                    </Col>
                    <Col></Col>
                  </Row>
                </FormGroup>
                <FormGroup>
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
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
                        type="textarea"
                        name="what_happend"
                        value={cardata.what_happend}
                        onChange={handleChange}
                        disabled={getIfDisabled()}
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
                        placeholder="סוג התקלה"
                        type="select"
                        name="type_happend"
                        value={cardata.type_happend}
                        onChange={handleChange}
                        id="selhappend"
                        disabled={getIfDisabled()}
                      >
                        <option value={"בחר"}>{"בחר"}</option>
                        <option value={"משבית"}>{"משבית"}</option>
                        <option value={"לא משבית"}>{"לא משבית"}</option>
                      </Input>
                    </Col>
                    <Col></Col>
                  </Row>
                </FormGroup>
                <FormGroup>
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
                      >
                        <option value={"בחר"}>{"בחר"}</option>
                        <option value={'אגד טנ"א ארצי'}>
                          {'אגד טנ"א ארצי'}
                        </option>
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
                        min={new Date().toISOString().split("T")[0]}
                        name="date_need"
                        value={cardata.date_need?.split("T")[0]}
                        onChange={handleChange}
                        disabled={getIfDisabled()}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col
                      style={{
                        justifyContent: "right",
                        alignContent: "right",
                        textAlign: "right",
                      }}
                    >
                      <h6 style={{}}>שם נציג היחידה לתיאום</h6>
                      <Input
                        placeholder="שם איש קשר"
                        type="string"
                        name="namecontact"
                        value={cardata.namecontact}
                        onChange={handleChange}
                        disabled={getIfDisabled()}
                      />
                    </Col>
                    <Col
                      style={{
                        justifyContent: "right",
                        alignContent: "right",
                        textAlign: "right",
                      }}
                    >
                      <h6 style={{}}>טלפון נציג היחידה לתיאום</h6>
                      <Input
                        placeholder="טלפון איש קשר"
                        type="tel"
                        name="numbercontact"
                        value={cardata.numbercontact}
                        onChange={handleChange}
                        disabled={getIfDisabled()}
                      />
                    </Col>
                  </Row>
                </FormGroup>

                {getIfDisabled() ? (
                  <>
                    {mails.map((p, index) => {
                      return (
                        <div>
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
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
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
                  </>
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
                <FormGroup>
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
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
                        disabled={getIfDisabled()}
                      >
                        <option value={"בחר"}>{"בחר"}</option>
                        <option value={true}>{"כן"}</option>
                        <option value={false}>{"לא"}</option>
                      </Input>
                    </Col>
                  </Row>
                </FormGroup>

                {user.role == "2" && cardata.status == "חדש" && (
                  <FormGroup>
                    <Row>
                      <Col
                        style={{
                          justifyContent: "right",
                          alignContent: "right",
                          textAlign: "right",
                        }}
                      >
                        <h6 style={{}}>אישור תחום כשירות מסגרות הטנ"א</h6>
                        <Input
                          placeholder='אישור תחום כשירות מסגרות הטנ"א'
                          type="select"
                          name="kshirot_tne"
                          value={cardata.kshirot_tne}
                          onChange={handleChange}
                          id="selkshirot_tne"
                        >
                          <option value={"בחר"}>{"בחר"}</option>
                          <option value={true}>{"אושר"}</option>
                          <option value={false}>{"נדחה"}</option>
                        </Input>
                      </Col>
                      <Col
                        style={{
                          justifyContent: "right",
                          alignContent: "right",
                          textAlign: "right",
                        }}
                      >
                        <h6 style={{}}>הערות תחום כשירות מסגרות הטנ"א</h6>
                        <Input
                          placeholder='הערות תחום כשירות מסגרות הטנ"א'
                          type="textare"
                          name="pirot_kshirot_tne"
                          value={cardata.pirot_kshirot_tne}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                )}
                {user.role == "0" &&
                  cardata.status == 'ממתין לאישור מכלול טנ"א' && (
                    <FormGroup>
                      <Row>
                        <Col
                          style={{
                            justifyContent: "right",
                            alignContent: "right",
                            textAlign: "right",
                          }}
                        >
                          <h6 style={{}}>אישור מכלול טנ"א מטכ"לי</h6>
                          <Input
                            placeholder='אישור מכלול טנ"א מטכ"לי'
                            type="select"
                            name="matcal_tne"
                            value={cardata.matcal_tne}
                            onChange={handleChange}
                            id="selmatcal_tne"
                          >
                            <option value={"בחר"}>{"בחר"}</option>
                            <option value={true}>{"אושר"}</option>
                            <option value={false}>{"נדחה"}</option>
                          </Input>
                        </Col>
                        <Col
                          style={{
                            justifyContent: "right",
                            alignContent: "right",
                            textAlign: "right",
                          }}
                        >
                          <h6 style={{}}>הערות מכלול טנ"א מטכ"לי</h6>
                          <Input
                            placeholder='הערות מכלול טנ"א מטכ"לי'
                            type="textare"
                            name="pirot_matcal_tne"
                            value={cardata.pirot_matcal_tne}
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  )}
                {user.role == "3" && cardata.status == "אושר" && (
                  <FormGroup>
                    <Row>
                      <Col
                        style={{
                          justifyContent: "right",
                          alignContent: "right",
                          textAlign: "right",
                        }}
                      >
                        <h6 style={{}}>שעת הגעה ליעד</h6>
                        <Input
                          placeholder="שעת הגעה ליעד"
                          type="datetime-local"
                          name="date_arrival"
                          value={cardata.date_arrival?.slice(0, 16)}
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
                        <h6 style={{}}>שעת התחלת המשימה</h6>
                        <Input
                          placeholder="שעת התחלת המשימה"
                          type="datetime-local"
                          name="date_start"
                          value={cardata.date_start?.slice(0, 16)}
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
                        <h6 style={{}}>שעת סיום המשימה</h6>
                        <Input
                          placeholder="שעת סיום המשימה"
                          type="datetime-local"
                          name="date_end"
                          value={cardata.date_end?.slice(0, 16)}
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
                        <h6 style={{}}>שעת הגעה ליחידת האם</h6>
                        <Input
                          placeholder="שעת הגעה ליחידת האם"
                          type="datetime-local"
                          name="date_return"
                          value={cardata.date_return?.slice(0, 16)}
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
                        <h6 style={{}}>חברי החוליה</h6>
                        <Input
                          placeholder="חברי החוליה"
                          type="textarea"
                          name="holi_group"
                          value={cardata.holi_group}
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
                        <h6 style={{}}>הערות</h6>
                        <Input
                          placeholder="הערות"
                          type="textarea"
                          name="note"
                          value={cardata.note}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
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

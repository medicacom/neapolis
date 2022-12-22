import React, { useEffect, useCallback } from "react";
import Select from "react-select";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchSpecialite } from "../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-multi-lang";
import { loginFetch, verificationEmail } from "../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";
import { openDB } from "idb/with-async-ittr";
import { toast } from "react-toastify";

function Donnes(props) {
  let lang = window.localStorage.getItem("lang");
  let db;
  const notifyErr = (msg) =>
    toast.error(
      <strong>
        <i className="fas fa-exclamation-circle"></i>
        {msg}
      </strong>
    );
  const [alert, setAlert] = React.useState(null);
  const t = useTranslation();
  const dispatch = useDispatch();
  const location = useParams();
  //input

  const [optionsSpecialite, setOptionsSpecialite] = React.useState([
    {
      value: "",
      label: "Specialite",
      isDisabled: true,
    },
  ]);

  /** start Specialite **/
  const getSpecialite = useCallback(async () => {
    var role = await dispatch(fetchSpecialite());
    var entities = role.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var nomSp =
        lang === "fr" ? e.nom : lang === e.nom_en ? "Speciality" : e.nom_ar;
      arrayOption.push({ value: e.id, label: nomSp });
    });
    setOptionsSpecialite(arrayOption);
  }, [dispatch]);
  /** end Specialite **/

  useEffect(() => {
    getSpecialite();
  }, [location.id, getSpecialite]);

  const confirmMessage = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Vous voulez vous connecter? Ce email existe déjà"}
        onConfirm={() => connect()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={t("login")}
        cancelBtnText={t("close")}
        showCancel
      >
        <Row>
          {/* <Col md="12">
            
          </Col> */}
          <Col md="12">
            <Form.Group>
              <Form.Control
                placeholder={t("User.email")}
                type="text"
                onChange={(value) => {
                  localStorage.setItem("email", value.target.value);
                }}
              ></Form.Control>
            </Form.Group>
            <br></br>
          </Col>
          <Col md="12">
            <Form.Group>
              <Form.Control
                placeholder={t("User.password")}
                onChange={(value) => {
                  localStorage.setItem("password", value.target.value);
                }}
                type="password"
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </SweetAlert>
    );
  };

  async function init(login, password) {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("detailUser", "readwrite");
    await tx.objectStore("detailUser").clear();
    await tx.objectStore("detailUser").add({
      id: 0,
      email: login,
      password: password,
      nom: "",
      prenom: "",
      id_role: "",
      etat: "",
      token: "",
      code: "",
    });
    window.location.replace("/profile");
  }

  //storeDetailUser
  async function storeDetailUser(email) {
    db = await openDB("medis", 1, {});
    let tx = db.transaction("detailUser", "readwrite");
    const index = tx.store.index("email");
    for await (let cursor of index.iterate(email)) {
      var objDetail = { ...cursor.value };
      localStorage.setItem("x-access-token", objDetail.token);
    }
    await tx.done;
    window.location.replace("/profile");
  }

  function connect(id, e) {
    var login = localStorage.getItem("email");
    var password = localStorage.getItem("password");
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var users = await dispatch(
          loginFetch({ login: login, password: password })
        );
        var entities = users.payload;
        resolve(entities);
      }, 0);
    });

    promise.then((value) => {
      if (value) {
        if (value.status !== 200) {
          notifyErr("Probléme de connexion");
        } else {
          localStorage.clear();
          localStorage.setItem("x-access-token", value.data.token);
          init(login, password);
        }
      } else {
        storeDetailUser(login);
      }
    });
    /* hideAlert();
    localStorage.clear();
    window.location.replace("/login"); */
  }

  const hideAlert = () => {
    setAlert(null);
  };

  const verifEmail = useCallback(
    async (email) => {
      var verif = await dispatch(verificationEmail({ email }));
      var res = verif.payload;
      if(res)
        confirmMessage();
    },
    [dispatch]
  );

  return (
    <>
      {alert}
      <Container fluid>
        <div className="section-declaration">
          <Container>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.name")} * </label>
                            <Form.Control
                              defaultValue={props.nom}
                              placeholder={t("User.name")}
                              name="Nom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setNom(value.target.value);
                                localStorage.setItem("nom", value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.last_name")}* </label>
                            <Form.Control
                              defaultValue={props.prenom}
                              placeholder={t("User.last_name")}
                              name="Prenom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setPrenom(value.target.value);
                                localStorage.setItem(
                                  "prenom",
                                  value.target.value
                                );
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.email")}* </label>
                            <Form.Control
                              defaultValue={props.email}
                              placeholder={t("User.email")}
                              name="Email"
                              className="required"
                              type="text"
                              onBlur={(value) => {
                                props.setEmail(value.target.value);
                                localStorage.setItem(
                                  "email",
                                  value.target.value
                                );
                                verifEmail(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.tel")} </label>
                            <Form.Control
                              defaultValue={props.tel}
                              placeholder={t("User.tel")}
                              type="number"
                              onChange={(value) => {
                                props.setTel(value.target.value);
                                localStorage.setItem("tel", value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={
                                  props.typeSpecialite === 1 ? true : false
                                }
                                defaultValue="1"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setIdSpecialite(0);
                                  props.setTypeSpecialite(1);
                                  localStorage.setItem("typeSpecialite", 1);
                                  localStorage.setItem("idSpecialite", 0);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("doctor")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={
                                  props.typeSpecialite === 2 ? true : false
                                }
                                defaultValue="2"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setIdSpecialite(102);
                                  props.setTypeSpecialite(2);
                                  localStorage.setItem("typeSpecialite", 2);
                                  localStorage.setItem("idSpecialite", 102);
                                  localStorage.setItem(
                                    "nomSpecialite",
                                    t("pharmacist")
                                  );
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("pharmacist")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={
                                  props.typeSpecialite === 3 ? true : false
                                }
                                defaultValue="3"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setTypeSpecialite(3);
                                  props.setIdSpecialite(121);
                                  localStorage.setItem("typeSpecialite", 3);
                                  localStorage.setItem("idSpecialite", 121);
                                  localStorage.setItem(
                                    "nomSpecialite",
                                    t("technician")
                                  );
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("technician")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={
                                  props.typeSpecialite === 4 ? true : false
                                }
                                defaultValue="4"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setTypeSpecialite(4);
                                  props.setIdSpecialite(120);
                                  localStorage.setItem("typeSpecialite", 4);
                                  localStorage.setItem("idSpecialite", 120);
                                  localStorage.setItem(
                                    "nomSpecialite",
                                    t("other")
                                  );
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("other")}
                            </Form.Check.Label>
                          </Form.Check>
                          {props.typeSpecialite === 1 ? (
                            <Form.Group>
                              <Select
                                placeholder={t("User.specialite")}
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={props.specialite}
                                onChange={(value) => {
                                  props.setSpecialite(value);
                                  props.setIdSpecialite(value.value);
                                  localStorage.setItem(
                                    "idSpecialite",
                                    value.value
                                  );
                                  localStorage.setItem(
                                    "nomSpecialite",
                                    value.label
                                  );
                                }}
                                options={optionsSpecialite}
                              />
                            </Form.Group>
                          ) : props.typeSpecialite === 4 ? (
                            <Form.Group>
                              <Form.Control
                                placeholder={t("other")}
                                type="text"
                                onBlur={(value) => {
                                  props.setAutreSp(value.target.value);
                                  localStorage.setItem(
                                    "autreSp",
                                    value.target.value
                                  );
                                }}
                              ></Form.Control>
                            </Form.Group>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <div className="clearfix"></div>
                    </Card.Body>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default Donnes;

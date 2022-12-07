import React, { useEffect, useCallback } from "react";
import Select from "react-select";
import validator from "validator";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { userAdded } from "../../../Redux/usersReduce";
import { fetchGouvernorat } from "../../../Redux/gouvernoratReduce";
import { fetchSpecialite } from "../../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-multi-lang";

function Inscription() {
  const t = useTranslation();
  let lang = window.localStorage.getItem("lang");
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i className="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else
      toast.error(
        <strong>
          <i className="fas fa-exclamation-circle"></i>
          {msg}
        </strong>
      );
  };
  const dispatch = useDispatch();
  const navigate = useHistory();
  const location = useParams();
  //input
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [typeSpecialite, setTypeSpecialite] = React.useState(0);
  const [specialite, setSpecialite] = React.useState(0);
  const [autreSp, setAutreSp] = React.useState("");

  const [role] = React.useState(2);
  const [id] = React.useState(0);
  const [valide] = React.useState(0);
  //required

  const [emailRequired] = React.useState(true);
  const [loginRequired] = React.useState(true);
  const [passwordRequired] = React.useState(true);

  const [optionsGouvernorat, setOptionsGouvernorat] = React.useState([
    {
      value: "",
      label: t("User.gouvernorat"),
      isDisabled: true,
    },
  ]);
  const [gouvernoratSelect, setGouvernoratSelect] = React.useState({
    value: 0,
    label: t("User.gouvernorat"),
  });

  const [optionsSpecialite, setOptionsSpecialite] = React.useState([
    {
      value: "",
      label: t("User.specialite"),
      isDisabled: true,
    },
  ]);
  const [specialiteSelect, setSpecialiteSelect] = React.useState({
    value: 0,
    label: t("User.specialite"),
  });
  async function submitForm() {
    var required = document.getElementsByClassName("required");
    var testPassword = true;
    for (var i = 0; i < required.length + 1; i++) {
      if (required[i] !== undefined) {
        document.getElementsByClassName("error")[i].innerHTML = "";
        required[i].style.borderColor = "#ccc";
        //condition required
        if (
          validator.isEmpty(required[i].value) &&
          required[i].name !== "Password"
        ) {
          required[i].style.borderColor = "red";
          document.getElementsByClassName("error")[i].innerHTML =
            required[i].name + " est obligatoire";
          notify(2, required[i].name + " doit etre non vide");
        }
        //condition email
        else if (
          required[i].name === "Email" &&
          !validator.isEmail(required[i].value)
        ) {
          notify(2, "E-mail invalide");
          document.getElementsByClassName("error")[i].innerHTML =
            "E-mail invalide";
        }
        //condition password
        else if (
          (required[i].name === "Password" && isNaN(location.id) === true) ||
          (required[i].name === "Password" &&
            !validator.isEmpty(required[i].value) &&
            isNaN(location.id) === false)
        ) {
          if (!validator.isLength(required[i].value, { min: 6, max: 20 })) {
            testPassword = false;
            notify(2, "Password doit etre minimum 6 charactére");
            document.getElementsByClassName("error")[i].innerHTML =
              "Password doit etre minimum 6 charactére";
          }
        }
      }
    }

    //role notif
    var roleClass = document.querySelector("#roleClass .react-select__control");
    roleClass.style.borderColor = "#ccc";
    if (role === 0) {
      roleClass.style.borderColor = "red";
      notify(2, "Choisire un role");
    }
    var id_gouvernorat = gouvernoratSelect.value;
    var id_sp = specialite;
    var autre_sp = autreSp;
    if (
      !validator.isEmpty(nom) &&
      !validator.isEmpty(prenom) &&
      validator.isEmail(email) &&
      !validator.isEmpty(login) &&
      testPassword === true &&
      id_sp !== 0
    ) {
      dispatch(
        userAdded({
          id,
          nom,
          prenom,
          email,
          tel,
          login,
          password,
          role,
          id_sp,
          id_gouvernorat,
          valide,
          autre_sp,
        })
      ).then((data) => {
        if (data.payload.msg === 1) {
          if (isNaN(location.id) === true) notify(1, t("demande_insciption"));
          setTimeout(async () => {
            listeUser();
          }, 1500);
        } else if (data.payload.msg === 2) {
          notify(2, t("problem"));
        } else if (data.payload.msg === 3) {
          notify(2, t("exist"));
        }
      });
    } else {
      notify(2, t("error"));
    }
  }

  /** start Gouvernorat **/
  const getGouvernorat = useCallback(async () => {
    var role = await dispatch(fetchGouvernorat());
    var entities = role.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: t("User.gouvernorat") });
    entities.forEach((e) => {
      var label = lang === "fr" ? e.libelle : lang === "en" ? e.libelle_en : e.libelle_ar;
      arrayOption.push({ value: e.id, label: label });
    });
    setOptionsGouvernorat(arrayOption);
  }, [dispatch]);

  /** end Gouvernorat **/

  /** start Specialite **/
  const getSpecialite = useCallback(async () => {
    var role = await dispatch(fetchSpecialite());
    var entities = role.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: t("User.specialite") });
    entities.forEach((e) => {
      var label = lang === "fr" ? e.nom : lang === "en" ? e.nom_en : e.nom_ar;
      arrayOption.push({ value: e.id, label: label });
    });
    setOptionsSpecialite(arrayOption);
  }, [dispatch]);

  /** end Gouvernorat **/

  useEffect(() => {
    getGouvernorat();
    getSpecialite();
  }, [location.id, getSpecialite]);

  function listeUser() {
    navigate.push("/utilisateurListe");
  }
  return (
    <>
      <Container fluid>
        {/* <ToastContainer /> */}
        <div className="inscription">
          <Container>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={nom}
                              placeholder={t("User.name")}
                              name="Nom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={prenom}
                              placeholder={t("User.last_name")}
                              name="Prenom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setPrenom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={login}
                              placeholder={t("User.login")}
                              className="required"
                              name="Login"
                              type="text"
                              onChange={(value) => {
                                setLogin(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                          {loginRequired ? null : (
                            <label className="error">
                              Login est obligatoire.
                            </label>
                          )}
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={password}
                              placeholder={t("User.password")}
                              className="required"
                              name="Password"
                              type="password"
                              onChange={(value) => {
                                setPassword(value.target.value);
                              }}
                            ></Form.Control>
                            <div className="error"></div>
                            {passwordRequired ? null : (
                              <label className="error">
                                Password est obligatoire.
                              </label>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={email}
                              placeholder={t("User.email")}
                              name="Email"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setEmail(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                          {emailRequired ? null : (
                            <label className="error">
                              Email est obligatoire.
                            </label>
                          )}
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Control
                              defaultValue={tel}
                              placeholder={t("User.tel")}
                              type="number"
                              onChange={(value) => {
                                setTel(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group id="roleClass">
                            <Select
                              placeholder={t("User.gouvernorat")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={gouvernoratSelect}
                              onChange={(value) => {
                                setGouvernoratSelect(value);
                              }}
                              options={optionsGouvernorat}
                            />
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue="1"
                                name="ageRadio"
                                type="radio"
                                onClick={() => setTypeSpecialite(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("doctor")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue="2"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  setTypeSpecialite(2);
                                  setSpecialite(102);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("pharmacist")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue="3"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  setTypeSpecialite(3);
                                  setSpecialite(121);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("technician")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue="4"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  setTypeSpecialite(4);
                                  setSpecialite(120);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("other")}
                            </Form.Check.Label>
                          </Form.Check>
                          {typeSpecialite === 1 ? (
                            <Form.Group>
                              <Select
                                placeholder={t("User.specialite")}
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={specialiteSelect}
                                onChange={(value) => {
                                  setSpecialiteSelect(value);
                                  setSpecialite(value.value);
                                }}
                                options={optionsSpecialite}
                              />
                            </Form.Group>
                          ) : typeSpecialite === 4 ? (
                            <Form.Group>
                              <Form.Control
                                placeholder={t("other")}
                                type="text"
                                onBlur={(value) => {
                                  setAutreSp(value.target.value);
                                }}
                              ></Form.Control>
                            </Form.Group>
                          ) : (
                            ""
                          )}
                        </Col>
                      </Row>
                      <br></br>
                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="success"
                        onClick={submitForm}
                      >
                        {t("save")}
                      </Button>
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

export default Inscription;

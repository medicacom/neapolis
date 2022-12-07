import React, { useState, useEffect, useRef } from "react";
import { loginFetch } from "../../../Redux/usersReduce";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Col,
  Tab,
  Nav,
  Row,
} from "react-bootstrap";
import { openDB } from "idb/with-async-ittr";
import Inscription from "./Inscription";
import { useTranslation } from "react-multi-lang";

function LoginPage() {
  const t = useTranslation();
  let lang = window.localStorage.getItem("lang");
  var ar = lang === "ar" ? " login-ar" : "";

  document.title = "NEAPOLIS";
  let db;
  const notifyErr = (msg) =>
    toast.error(
      <strong>
        <i className="fas fa-exclamation-circle"></i>
        {msg}
      </strong>
    );
  const dispatch = useDispatch();
  const [cardClasses, setCardClasses] = useState("card-hidden");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    setTimeout(function () {
      setCardClasses("");
    }, 1000);
  });
  function loginChange(event) {
    setLogin(event.target.value);
  }
  function passwordChange(event) {
    setPassword(event.target.value);
  }
  function enterKeyPressed(event) {
    if (event.charCode === 13) {
      submitForm();
      return true;
    } else {
      return false;
    }
  }

  async function init(login, password) {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("detailUser", "readwrite");
    await tx.objectStore("detailUser").clear();
    await tx.objectStore("detailUser").add({
      id: 0,
      login: login,
      password: password,
      nom: "",
      prenom: "",
      email: "",
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
    window.location.replace("/roleList");
  }

  //submitForm
  const submitForm = (event) => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var root = await dispatch(
          loginFetch({ login: login, password: password })
        );
        var entities = root.payload;
        resolve(entities);
      }, 0);
    });

    promise.then((value) => {
      if (value) {
        if (value.status !== 200) {
          notifyErr("Probléme de connexion");
        } else {
          localStorage.setItem("x-access-token", value.data.token);
          init(login, password);
        }
      } else {
        storeDetailUser(login);
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="full-gray section-image" data-color="black">
        <div className="content d-grid align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="5" md="8">
              <Form action="" className="form" method="" onSubmit={submitForm}>
                <Card className={"card-login " + cardClasses+ar}>
                  <div className="flag">
                    <img
                      src={require("../../../assets/img/en.png")}
                      alt="en"
                      onClick={(e) => {
                        window.localStorage.setItem("lang", "en");
                        window.location.reload();
                      }}
                    />
                    <img
                      src={require("../../../assets/img/fr.png")}
                      alt="fr"
                      onClick={(e) => {
                        window.localStorage.setItem("lang", "fr");
                        window.location.reload();
                      }}
                    />
                    <img
                      src={require("../../../assets/img/ar.png")}
                      alt="ar"
                      onClick={(e) => {
                        window.localStorage.setItem("lang", "ar");
                        window.location.reload();
                      }}
                    />
                  </div>
                  <img
                    src={require("../../../assets/img/logo.png")}
                    alt="medicacom"
                  />
                  <Card.Body>
                    <Tab.Container
                      id="icons-tabs-example"
                      defaultActiveKey="settings-icons"
                    >
                      <Nav role="tablist" variant="tabs">
                        <Nav.Item>
                          <Nav.Link eventKey="settings-icons">
                            {t("sign_in")}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="info-icons">
                            {t("register")}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="info-icons">
                          <Inscription></Inscription>
                        </Tab.Pane>
                        <Tab.Pane eventKey="settings-icons">
                          <Row>
                            <Col md="12">
                              <Form.Group>
                                <Form.Control
                                  onKeyPress={enterKeyPressed}
                                  placeholder="Login"
                                  type="text"
                                  onChange={loginChange}
                                ></Form.Control>
                              </Form.Group>
                              <br></br>
                            </Col>
                            <Col md="12">
                              <Form.Group>
                                <Form.Control
                                  placeholder={t("User.password")}
                                  onKeyPress={enterKeyPressed}
                                  onChange={passwordChange}
                                  type="password"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          <div className="ml-auto mr-auto footer-login">
                            <Button
                              className="btn-wd"
                              type="button"
                              variant="info"
                              onClick={submitForm}
                            >
                              {t("login")}
                            </Button>
                            <Button
                              /* className="btn-wd" */
                              type="button"
                              variant="link"
                              onClick={() =>
                                window.location.replace("/declaration")
                              }
                            >
                              {t("statement")}
                            </Button>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

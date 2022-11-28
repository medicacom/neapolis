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
  Collapse,
} from "react-bootstrap";
import { openDB } from "idb/with-async-ittr";
import Inscription from "./Inscription";

function LoginPage() {
  document.title = "NEAPOLIS";
  var ifConnected = window.navigator.onLine;
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
  async function storeDetailUser(login) {
    db = await openDB("medis", 1, {});
    let tx = db.transaction("detailUser", "readwrite");
    const index = tx.store.index("login");
    for await (let cursor of index.iterate(login)) {
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
        <div className="content d-flex align-items-center p-0">
          <Container>
            <Col className="mx-auto" lg="4" md="8">
              <Form action="" className="form" method="" onSubmit={submitForm}>
                <Card className={"card-login " + cardClasses}>
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
                            Connexion
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="info-icons">
                            S'inscrire
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="info-icons">
                          <Inscription></Inscription>
                        </Tab.Pane>
                        <Tab.Pane eventKey="settings-icons">
                          <Form.Group>
                            <label>Login</label>
                            <Form.Control
                              onKeyPress={enterKeyPressed}
                              placeholder="Login"
                              type="text"
                              onChange={loginChange}
                            ></Form.Control>
                          </Form.Group>
                          <Form.Group>
                            <label>Mot de passe</label>
                            <Form.Control
                              placeholder="Password"
                              onKeyPress={enterKeyPressed}
                              onChange={passwordChange}
                              type="password"
                            ></Form.Control>
                          </Form.Group>
                          <div className="ml-auto mr-auto footer-login">
                            <Button
                              className="btn-wd"
                              type="button"
                              variant="info"
                              onClick={submitForm}
                            >
                              Connexion
                            </Button>
                            <Button
                              className="btn-wd"
                              type="button"
                              variant="info"
                              onClick={()=>window.location.replace("/declaration")}
                            >
                              Déclaration
                            </Button>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                    {/* <Form.Group>
                    <label>Login</label>
                    <Form.Control
                      onKeyPress={enterKeyPressed}
                      placeholder="Login"
                      type="text"
                      onChange={loginChange}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label>Mot de passe</label>
                    <Form.Control
                      placeholder="Password"
                      onKeyPress={enterKeyPressed}
                      onChange={passwordChange}
                      type="password"
                    ></Form.Control>
                  </Form.Group> */}
                  </Card.Body>
                  {/* <Card.Footer className="ml-auto mr-auto">
                  <Button
                    className="btn-wd"
                    type="button"
                    variant="success"
                    onClick={submitForm}
                  >
                    Connexion
                  </Button>
                </Card.Footer> */}
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

import React, { useEffect, useCallback } from "react";
import Select from "react-select";
import validator from "validator";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { userAdded, userGetById } from "../../../Redux/usersReduce";
import { fetchRole } from "../../../Redux/roleReduce";
import { fetchGouvernorat } from "../../../Redux/gouvernoratReduce";
import { fetchSpecialite } from "../../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
import { useTranslation } from "react-multi-lang";

function AjouterUser({ onlineStatus }) {
  const t = useTranslation();
  let db;
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
  const [role, setRole] = React.useState(0);
  const [id, setId] = React.useState(0);
  const [valide] = React.useState(1);
  //required

  const [emailRequired] = React.useState(true);
  const [loginRequired] = React.useState(true);
  const [passwordRequired] = React.useState(true);
  const [roleRequired] = React.useState(true);
  const etat = 1;

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Role",
      isDisabled: true,
    },
  ]);
  const [roleSelect, setRoleSelect] = React.useState({
    value: 0,
    label: "Role",
  });

  const [optionsGouvernorat, setOptionsGouvernorat] = React.useState([
    {
      value: "",
      label: "Gouvernorat",
      isDisabled: true,
    },
  ]);
  const [gouvernoratSelect, setGouvernoratSelect] = React.useState({
    value: 0,
    label: "Gouvernorat",
  });

  const [optionsSpecialite, setOptionsSpecialite] = React.useState([
    {
      value: "",
      label: "Specialite",
      isDisabled: true,
    },
  ]);
  const [specialiteSelect, setSpecialiteSelect] = React.useState({
    value: 0,
    label: "Specialite",
  });

  async function saveIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("users", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objRole = { ...cursor.value };
        objRole.nom = nom;
        objRole.prenom = prenom;
        objRole.login = login;
        objRole.email = email;
        objRole.id_role = roleSelect.value;
        objRole.tel = tel;
        objRole.nom_role = roleSelect.label;
        objRole.password = password;
        /* objRole.password = password == ""?objRole.password:password; */
        objRole.etat = 1;
        objRole.updated = 1;
        cursor.update(objRole);
      }
      await tx.done;
      notify(1, t("update_txt"));
    } else {
      let rolesStore = tx.objectStore("users");
      let users = await rolesStore.getAll();
      await tx.objectStore("users").add({
        nom: nom,
        prenom: prenom,
        login: login,
        email: email,
        id_role: roleSelect.value,
        tel: tel,
        nom_role: roleSelect.label,
        password: password,
        saved: 0,
        type_table: 3,
        etat: 1,
        id: users[users.length - 1].id + 1,
      });
      notify(1, t("add_txt"));
    }
    setTimeout(async () => {
      listeUser();
    }, 1500);
  }
  async function submitForm(event) {
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
    var id_sp = specialiteSelect.value;
    if (
      !validator.isEmpty(nom) &&
      !validator.isEmpty(prenom) &&
      validator.isEmail(email) &&
      !validator.isEmpty(login) &&
      testPassword === true &&
      role > 0
    ) {
      //mode online
      if (onlineStatus === 1) {
        dispatch(
          userAdded({
            nom,
            prenom,
            email,
            tel,
            login,
            password,
            id,
            etat,
            role,
            id_sp,
            id_gouvernorat,
            valide,
          })
        ).then((data) => {
          if (data.payload === true) {
            if (isNaN(location.id) === true) notify(1, t("add_txt"));
            else notify(1, t("update_txt"));
            setTimeout(async () => {
              listeUser();
            }, 1500);
          } else {
            notify(2, t("problem"));
          }
        });
      } else {
        saveIndex();
      }
    }
  }

  const getUserById = useCallback(async () => {
    var user = await dispatch(userGetById(location.id));
    var entities = user.payload.user;
    setNom(entities.nom);
    setPrenom(entities.prenom);
    setEmail(entities.email);
    setLogin(entities.login);
    setTel(entities.tel);
    setRole(entities.id_role);
    setRoleSelect({ value: entities.roles.id, label: entities.roles.nom });
    setGouvernoratSelect({
      value: entities.gouvernorats.id,
      label: entities.gouvernorats.libelle,
    });
    setSpecialiteSelect({
      value: entities.gouvernorats.id,
      label: entities.specialites.nom,
    });
    setId(location.id);
  }, [dispatch]);

  /** start role **/
  const getRole = useCallback(async () => {
    var role = await dispatch(fetchRole());
    var entities = role.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Role" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptions(arrayOption);
  }, [dispatch]);

  async function initRole() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("roles", "readwrite");
    let rolesStore = tx.objectStore("roles");
    let entities = await rolesStore.getAll();
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Role" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptions(arrayOption);
  }

  /** end role **/

  /** start Gouvernorat **/
  const getGouvernorat = useCallback(async () => {
    var role = await dispatch(fetchGouvernorat());
    var entities = role.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Gouvernorat" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle });
    });
    setOptionsGouvernorat(arrayOption);
  }, [dispatch]);

  async function initGouvernorat() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("gouvernorats", "readwrite");
    let gouvStore = tx.objectStore("gouvernorats");
    let entities = await gouvStore.getAll();
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Gouvernorat" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle });
    });
    setOptionsGouvernorat(arrayOption);
  }

  /** end Gouvernorat **/

  /** start Specialite **/
  const getSpecialite = useCallback(async () => {
    var role = await dispatch(fetchSpecialite());
    var entities = role.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Specialite" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionsSpecialite(arrayOption);
  }, [dispatch]);

  async function initSpecialite() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("specialites", "readwrite");
    let gouvStore = tx.objectStore("specialites");
    let entities = await gouvStore.getAll();
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Specialite" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionsSpecialite(arrayOption);
  }

  /** end Gouvernorat **/

  async function initUser() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("users", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var obj = { ...cursor.value };
      setNom(obj.nom);
      setPrenom(obj.prenom);
      setEmail(obj.email);
      setLogin(obj.login);
      setTel(obj.tel);
      setRole(obj.id_role);
      setRoleSelect({ value: obj.id_role, label: obj.nom_role });
      setId(location.id);
    }
    await tx.done;
  }

  useEffect(() => {
    if (onlineStatus === 1) {
      getRole();
      getGouvernorat();
      getSpecialite();
      if (isNaN(location.id) === false) getUserById();
    } else {
      initRole();
      initGouvernorat();
      initSpecialite();
      if (isNaN(location.id) === false) initUser();
    }
  }, [location.id, getUserById, getRole, getSpecialite, dispatch]);

  function listeUser() {
    navigate.push("/utilisateurListe");
  }
  return (
    <>
      <Container fluid>
        <ToastContainer />
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd  mr-1 float-left"
                  type="button"
                  variant="success"
                  onClick={listeUser}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  Retour à la liste
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? t("User.add")
                            : t("User.update")}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("User.name")} * </label>
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
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("User.last_name")} </label>
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
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("User.login")}* </label>
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
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("User.password")}* </label>
                            <Form.Control
                              defaultValue={password}
                              placeholder="Password"
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
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("User.email")}* </label>
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
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>{t("User.role")}* </label>
                            <Select
                              placeholder={t("User.role")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={roleSelect}
                              onChange={(value) => {
                                setRoleSelect(value);
                                setRole(value.value);
                              }}
                              options={options}
                            />
                          </Form.Group>
                          {roleRequired ? null : (
                            <div className="error">Role est obligatoire.</div>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>{t("User.gouvernorat")}* </label>
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
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>{t("User.specialite")} </label>
                            <Select
                              placeholder={t("User.specialite")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={specialiteSelect}
                              onChange={(value) => {
                                setSpecialiteSelect(value);
                              }}
                              options={optionsSpecialite}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("User.tel")} </label>
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

export default AjouterUser;

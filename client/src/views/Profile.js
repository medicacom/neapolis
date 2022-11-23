import React, { useCallback } from "react";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { profilUpdated } from "../Redux/usersReduce";
import { fetchRole } from "../Redux/roleReduce";
import { getActiveSpecialite } from "../Redux/specialiteReduce";
import { fetchRootBase } from "../Redux/rootBaseReduce";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { openDB } from "idb";
/* import { Notifications } from "react-push-notification"; */
import { fetchAnnee } from "../Redux/anneeReduce";
import { fetchGouvernorat } from "../Redux/gouvernoratReduce";

function Profile({ obj,onlineStatus }) {
  console.log(obj)
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
  var id = onlineStatus === 1?obj.user.id:obj.id;
  var nomStore = onlineStatus === 1?obj.user.nom:obj.nom;
  var prenomStore = onlineStatus === 1?obj.user.prenom:obj.prenom;
  var telStore = onlineStatus === 1?obj.user.tel:obj.tel;
  var loginStore = onlineStatus === 1?obj.user.login:obj.login;

  const [nom, setNom] = React.useState(nomStore);
  const [prenom, setPrenom] = React.useState(prenomStore);
  const [tel, setTel] = React.useState(telStore);
  const [login, setLogin] = React.useState(loginStore);
  const [password, setPassword] = React.useState("");
  function submitForm() {
    if (
      nom === "" ||
      prenom === "" ||
      login === "" ||
      (password !== "" && password.length < 6)
    ) {
      notify(2, "Toutes les données sont obligatoires");
    } else {
      notify(1, "Modifier avec succes");
      dispatch(profilUpdated({ nom, prenom, tel, login, password, id }));
    }
  }

  //storeRoles
  const storeRoles = useCallback(async () => {
    var role = await dispatch(fetchRole());
    var resRole = await role.payload;
    const tx = db.transaction("roles", "readwrite");
    for (let index = 0; index < resRole.length; index++) {
      await tx.objectStore("roles").add({
        nom: resRole[index].nom,
        order: resRole[index].order,
        role: resRole[index].role,
        id: resRole[index].id,
        saved:1,
        updated:0,
        deleted:0,
        type_table:2
      });
    }
  }, [dispatch]);

  async function clearRole() {
    let txRole = db.transaction("roles", "readwrite");
    await txRole.objectStore("roles").clear();
    storeRoles();
  }

  //storeAnnee
  const storeAnnee = useCallback(async () => {
    var annees = await dispatch(fetchAnnee());
    var resAnnee = await annees.payload;
    const tx = db.transaction("annees", "readwrite");
    for (let index = 0; index < resAnnee.length; index++) {
      await tx.objectStore("annees").add({
        annee: resAnnee[index].annee,
        id: resAnnee[index].id,
      });
    }
  }, [dispatch]);

  async function clearAnnee() {
    let txRole = db.transaction("annees", "readwrite");
    await txRole.objectStore("annees").clear();
    storeAnnee();
  }

  //storeGouvernorat
  const storeGouvernorat = useCallback(async () => {
    var gouvernorats = await dispatch(fetchGouvernorat());
    var resGouv = await gouvernorats.payload;
    const tx = db.transaction("gouvernorats", "readwrite");
    for (let index = 0; index < resGouv.length; index++) {
      await tx.objectStore("gouvernorats").add({
        libelle: resGouv[index].libelle,
        id: resGouv[index].id,
      });
    }
  }, [dispatch]);

  async function clearGouvernorats() {
    let txGouv = db.transaction("gouvernorats", "readwrite");
    await txGouv.objectStore("gouvernorats").clear();
    storeGouvernorat();
  }

  //storeSpecialite
  const storeSpecialite = useCallback(async () => {
    var gouvernorats = await dispatch(getActiveSpecialite());
    var resGouv = await gouvernorats.payload;
    const tx = db.transaction("specialites", "readwrite");
    for (let index = 0; index < resGouv.length; index++) {
      await tx.objectStore("specialites").add({
        nom: resGouv[index].nom,
        id: resGouv[index].id,
      });
    }
  }, [dispatch]);

  async function clearSpecialite() {
    let txGouv = db.transaction("specialites", "readwrite");
    await txGouv.objectStore("specialites").clear();
    storeSpecialite();
  }

  //storeRoots
  const storeRoots = useCallback(async () => {
    var root = await dispatch(fetchRootBase());
    var resRoots = await root.payload;
    const tx = db.transaction("rootBase", "readwrite");
    for (let index = 0; index < resRoots.length; index++) {
      await tx.objectStore('rootBase').add({
        id: resRoots[index].id,
        name: resRoots[index].name,
        className: resRoots[index].className,
        path: resRoots[index].path,
        component: resRoots[index].component,
        icon:resRoots[index].icon,
        role: resRoots[index].role,
        ordre: resRoots[index].ordre,
        parent: resRoots[index].parent,
        saved:1,
        updated:0,
        deleted:0,
        type_table:1
      });
      
    }
  }, [dispatch]);

  async function clearRoots() {
    let tx = db.transaction("rootBase", "readwrite");
    await tx.objectStore("rootBase").clear();
    storeRoots();
  }

  async function storeDetailUser() {
    let tx = db.transaction("detailUser", "readwrite");
    const index = tx.store.index('login');
    for await (let cursor of index.iterate(obj.user.login)) {
      var objDetail = { ...cursor.value };
      objDetail.id = obj.user.id;
      objDetail.nom = obj.user.nom;
      objDetail.prenom = obj.user.prenom;
      objDetail.email = obj.user.email;
      objDetail.id_role = obj.user.id_role;
      objDetail.etat = obj.user.etat;
      objDetail.token = obj.user.token;
      objDetail.code = obj.user.code;
      cursor.update(objDetail);
    }
    await tx.done;
  }

  async function init() {
    db = await openDB("medis", 1, {});
    clearRole();
    clearRoots();
    clearAnnee();
    clearGouvernorats();
    clearSpecialite();
    storeDetailUser();
  }

  React.useEffect(() => {
    if(onlineStatus === 1){
      init();
    }
  }, [init]);
  return (
    <>
      <ToastContainer />
      <Container fluid>
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">Mon profil</Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom* </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder="Nom"
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Prénom </label>
                            <Form.Control
                              defaultValue={prenom}
                              placeholder="Prénom"
                              type="text"
                              onChange={(value) => {
                                setPrenom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Login*</label>
                            <Form.Control
                              id="Login_user"
                              defaultValue={login}
                              placeholder="Login"
                              type="text"
                              onChange={(value) => {
                                setLogin(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Mot de passe* (6 chiffre minimum)</label>
                            <Form.Control
                              id="mdp_user"
                              defaultValue=""
                              placeholder="Mote de passe"
                              type="password"
                              onChange={(value) => {
                                setPassword(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Telephone </label>
                            <Form.Control
                              defaultValue={tel}
                              placeholder="Telephone"
                              type="text"
                              onChange={(value) => {
                                setTel(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      {/* <Notifications /> */}
                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="success"
                        onClick={submitForm}
                      >
                        Enregistrer
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

export default Profile;

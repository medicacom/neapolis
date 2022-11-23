import React, { useEffect, useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { effet_indesirableAdded, effet_indesirableGetById } from "../../../Redux/effet_indesirableReduce";
import { send } from "../../utils/utils";

import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
function AjouterEffet_indesirable({ onlineStatus }) {
  /* var ifConnected = window.navigator.onLine; */
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
  const location = useParams();
  const navigate = useHistory();
  const [description, setDescription] = React.useState("");
  const [id, setId] = React.useState(0);

  async function saveEffet_indesirableIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("effet_indesirables", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objEffet_indesirable = { ...cursor.value };
        objEffet_indesirable.description = description;
        objEffet_indesirable.updated = 1;
        objEffet_indesirable.etat = 1;
        cursor.update(objEffet_indesirable);
      }
      await tx.done;
      notify(1, "Modifier avec succes");
    } else {
      let effet_indesirableStore = tx.objectStore("effet_indesirables");
      let effet_indesirable = await effet_indesirableStore.getAll();
      await tx.objectStore("effet_indesirables").add({
        description: description,
        type_table:6,
        saved: 0,
        etat:1,
        id: effet_indesirable.length !==0 ? effet_indesirable[effet_indesirable.length - 1].id + 1 : 1,
      });
      notify(1, "Insertion avec succes");
    }          
    setTimeout(async () => {
      listeEffet_indesirable();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      if (description !== "") {
        dispatch(effet_indesirableAdded({ description, id })).then((data)=>{
          if (data.payload.msg === true) {
            if (isNaN(location.id) === true) {
              notify(1, "Insertion avec succes");
            } else {
              notify(1, "Modifier avec succes");
            }

          } else {
            notify(2, "Problème de connexion");
          }
          
          setTimeout(async () => {
            listeEffet_indesirable();
          }, 1500);
        });
      } else {
        notify(2, "Vérifier vos donnée");
      }
    } else {
      if (description !== "") {
        saveEffet_indesirableIndex();
      } else {
        notify(2, "Vérifier vos donnée");
      }
    }
  }

  async function initEffet_indesirable() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("effet_indesirables", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objEffet_indesirable = { ...cursor.value };
      setDescription(objEffet_indesirable.description);
      setId(objEffet_indesirable);
    }
    await tx.done;
  }

  useEffect(() => {
    async function getEffet_indesirable() {
      if (isNaN(location.id) === false) {
        var effet_indesirable = await dispatch(effet_indesirableGetById(location.id));
        var entities = effet_indesirable.payload;
        setDescription(entities.titre);
        setId(location.id);
      }
    }
    if (onlineStatus === 1) getEffet_indesirable();
    else {
      if (isNaN(location.id) === false) initEffet_indesirable();
    }
  }, [location.id, dispatch]);

  function listeEffet_indesirable() {
    navigate.push("/listEffet_indesirable");
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
                  onClick={listeEffet_indesirable}
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
                            ? "Ajouter effet indesirable"
                            : "Modifier effet indesirable"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Description * </label>
                            <Form.Control
                              defaultValue={description}
                              placeholder="Description"
                              type="text"
                              onChange={(value) => {
                                setDescription(value.target.value);
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

export default AjouterEffet_indesirable;

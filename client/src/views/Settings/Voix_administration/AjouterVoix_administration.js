import React, { useEffect, useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import {
  voix_administrationAdded,
  voix_administrationGetById,
} from "../../../Redux/voix_administrationReduce";

import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
import { useTranslation } from "react-multi-lang";
function AjouterVoix_administration({ onlineStatus }) {
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
  const location = useParams();
  const navigate = useHistory();
  const [description, setDescription] = React.useState("");
  const [descriptionEn, setDescriptionEn] = React.useState("");
  const [descriptionAr, setDescriptionAr] = React.useState("");
  const [id, setId] = React.useState(0);

  async function saveVoix_administrationIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("voix_administrations", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objVoix_administration = { ...cursor.value };
        objVoix_administration.description = description;
        objVoix_administration.updated = 1;
        objVoix_administration.etat = 1;
        cursor.update(objVoix_administration);
      }
      await tx.done;
      notify(1, t("update_txt"));
    } else {
      let voix_administrationStore = tx.objectStore("voix_administrations");
      let voix_administration = await voix_administrationStore.getAll();
      await tx.objectStore("voix_administrations").add({
        description: description,
        type_table: 5,
        saved: 0,
        etat: 1,
        id:
          voix_administration.length !== 0
            ? voix_administration[voix_administration.length - 1].id + 1
            : 1,
      });
      notify(1, t("add_txt"));
    }
    setTimeout(async () => {
      listeVoix_administration();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      if (description !== "") {
        dispatch(voix_administrationAdded({
          description: description,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          id: id,
        })).then((val) => {
          if (val.payload.msg === true) {
            if (isNaN(location.id) === true) {
              notify(1, t("add_txt"));
            } else {
              notify(1, t("update_txt"));
            }
          } else {
            notify(2, t("problem"));
          }
        });
      } else {
        notify(2, t("erreur"));
      }
      setTimeout(async () => {
        listeVoix_administration();
      }, 1500);
    } else {
      if (description !== "") {
        saveVoix_administrationIndex();
      } else {
        notify(2, t("erreur"));
      }
    }
  }

  async function initVoix_administration() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("voix_administrations", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objVoix_administration = { ...cursor.value };
      setDescription(objVoix_administration.description);
      setId(objVoix_administration);
    }
    await tx.done;
  }

  useEffect(() => {
    async function getVoix_administration() {
      if (isNaN(location.id) === false) {
        var voix_administration = await dispatch(
          voix_administrationGetById(location.id)
        );
        var entities = voix_administration.payload;
        setDescription(entities.description);
        setDescriptionAr(entities.description_ar);
        setDescriptionEn(entities.description_en);
        setId(location.id);
      }
    }
    if (onlineStatus === 1) getVoix_administration();
    else {
      if (isNaN(location.id) === false) initVoix_administration();
    }
  }, [location.id, dispatch]);

  function listeVoix_administration() {
    navigate.push("/listVoix_administration");
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
                  onClick={listeVoix_administration}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  {t("list")}
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
                            ? t("voice.add_voice")
                            : t("voice.update_voice")}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("description")} * </label>
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
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("description")} EN* </label>
                            <Form.Control
                              defaultValue={descriptionEn}
                              placeholder={t("description")+ " EN"}
                              type="text"
                              onChange={(value) => {
                                setDescriptionEn(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("description")} AR* </label>
                            <Form.Control
                              defaultValue={descriptionAr}
                              placeholder={t("description")+ " AR"}
                              type="text"
                              onChange={(value) => {
                                setDescriptionAr(value.target.value);
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

export default AjouterVoix_administration;

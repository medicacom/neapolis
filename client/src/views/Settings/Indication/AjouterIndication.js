import React, { useEffect } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import {
  indicationAdded,
  indicationGetById,
} from "../../../Redux/indicationReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
import { useTranslation } from "react-multi-lang";
function AjouterIndication({ onlineStatus }) {
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

  async function saveIndicationIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("indications", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objIndication = { ...cursor.value };
        objIndication.description = description;
        objIndication.updated = 1;
        objIndication.etat = 1;
        cursor.update(objIndication);
      }
      await tx.done;
      notify(1, t("update_txt"));
    } else {
      let indicationStore = tx.objectStore("indications");
      let indication = await indicationStore.getAll();
      await tx.objectStore("indications").add({
        description: description,
        description_en: descriptionEn,
        description_ar: descriptionAr,
        type_table: 6,
        saved: 0,
        etat: 1,
        id:
          indication.length !== 0
            ? indication[indication.length - 1].id + 1
            : 1,
      });
      notify(1, t("add_txt"));
    }

    setTimeout(async () => {
      listeIndication();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      if (description !== "") {
        dispatch(indicationAdded({
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
        listeIndication();
      }, 1500);
    } else {
      if (description !== "") {
        saveIndicationIndex();
      } else {
        notify(2, t("erreur"));
      }
    }
  }

  async function initIndication() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("indications", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objIndication = { ...cursor.value };
      setDescription(objIndication.description);
      setId(objIndication);
      /* objIndication.description = 55;
      cursor.update(objIndication); */
    }
    await tx.done;
  }

  useEffect(() => {
    async function getIndication() {
      if (isNaN(location.id) === false) {
        var indication = await dispatch(indicationGetById(location.id));
        var entities = indication.payload;
        setDescription(entities.description);
        setDescriptionAr(entities.description_ar);
        setDescriptionEn(entities.description_en);
        setId(location.id);
      }
    }
    if (onlineStatus === 1) getIndication();
    else {
      if (isNaN(location.id) === false) initIndication();
    }
  }, [location.id, dispatch]);

  function listeIndication() {
    navigate.push("/listIndication");
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
                  onClick={listeIndication}
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
                            ? t("indication.add")
                            : t("indication.update")}
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

export default AjouterIndication;

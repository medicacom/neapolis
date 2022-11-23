import React, { useEffect, useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { newsAdded, newsGetById } from "../../../Redux/newsReduce";
import { send } from "../../utils/utils";

import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
function AjouterNews({ onlineStatus }) {
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
  const [date, setDate] = React.useState("");
  const [titre, setTitre] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [id, setId] = React.useState(0);

  async function saveNewsIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("news", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objNews = { ...cursor.value };
        objNews.titre = titre;
        objNews.description = description;
        objNews.date = date;
        objNews.updated = 1;
        objNews.etat = 1;
        cursor.update(objNews);
      }
      await tx.done;
      notify(1, "Modifier avec succes");
    } else {
      let newsStore = tx.objectStore("news");
      let news = await newsStore.getAll();
      await tx.objectStore("news").add({
        date: date,
        description: description,
        titre: titre,
        type_table: 4,
        saved: 0,
        etat:1,
        id:news.length !==0? news[news.length - 1].id + 1 : 1,
      });
      notify(1, "Insertion avec succes");
    }
          
    setTimeout(async () => {
      listeNews();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      if (date !== "" && description !== "" && titre !== "") {
        dispatch(newsAdded({ date, titre, description, id })).then((val)=>{
          if (val.payload.msg === true) {
            if (isNaN(location.id) === true) {
              notify(1, "Insertion avec succes");
            } else {
              notify(1, "Modifier avec succes");
            }
            send(val.payload.data.id);
          } else {
            notify(2, "Problème de connexion");
          }

        });
      } else {
        notify(2, "Vérifier vos donnée");
      }
          
      setTimeout(async () => {
        listeNews();
      }, 1500);
    } else {
      if (date !== "" && description !== "" && titre !== "") {
        saveNewsIndex();
      } else {
        notify(2, "Vérifier vos donnée");
      }
    }
  }

  async function initNews() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("news", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objNews = { ...cursor.value };
      setDate(objNews.date);
      setDescription(objNews.description);
      setTitre(objNews.titre);
      setId(objNews);
      /* objNews.description = 55;
      cursor.update(objNews); */
    }
    await tx.done;
  }

  useEffect(() => {
    async function getNews() {
      if (isNaN(location.id) === false) {
        var news = await dispatch(newsGetById(location.id));
        var entities = news.payload;
        setDate(entities.date);
        setTitre(entities.description);
        setDescription(entities.titre);
        setId(location.id);
      }
    }
    if (onlineStatus === 1) getNews();
    else {
      if (isNaN(location.id) === false) initNews();
    }
  }, [location.id, dispatch]);

  function listeNews() {
    navigate.push("/listNews");
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
                  onClick={listeNews}
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
                            ? "Ajouter news"
                            : "Modifier news"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Titre * </label>
                            <Form.Control
                              defaultValue={titre}
                              placeholder="Titre"
                              type="text"
                              onChange={(value) => {
                                setTitre(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
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
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Date * </label>
                            <Form.Control
                              defaultValue={date}
                              placeholder="Date"
                              type="date"
                              onChange={(value) => {
                                setDate(value.target.value);
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

export default AjouterNews;

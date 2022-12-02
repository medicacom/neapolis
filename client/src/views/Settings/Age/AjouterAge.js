import React, { useEffect } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { ageAdded, ageGetById } from "../../../Redux/ageReduce";

import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-multi-lang";

function AjouterAge() {
  const t = useTranslation();
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useHistory();
  if (isNaN(location.id) === true) document.title = "Ajouter age";
  else document.title = "Modifier le age";
  const [description, setDescription] = React.useState("");
  const [descriptionEn, setDescriptionEn] = React.useState("");
  const [descriptionAr, setDescriptionAr] = React.useState("");
  const [id, setId] = React.useState(0);

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
  function submitForm(event) {
    dispatch(ageAdded({
      description: description,
      description_en: descriptionEn,
      description_ar: descriptionAr,
      id: id,
    }));
    if (isNaN(location.id) === true) {
      notify(1, t("add_txt"));
    } else {
      notify(1, t("update_txt"));
    }
  }

  useEffect(() => {
    async function getAge() {
      if (isNaN(location.id) === false) {
        var age = await dispatch(ageGetById(location.id));
        var entities = age.payload;
        if (entities === false) {
          listeAge();
        } else {
          setDescription(entities.description);
          setDescriptionAr(entities.description_ar);
          setDescriptionEn(entities.description_en);
          setId(location.id);
        }
      }
    }
    getAge();
  }, [location.id, dispatch, navigate]);

  function listeAge() {
    navigate.push("/listAge");
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
                  onClick={listeAge}
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
                            ? t("age.add")
                            : t("age.update")}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Description* </label>
                            <Form.Control
                              defaultValue={description}
                              placeholder="Age"
                              type="text"
                              onChange={(value) => {
                                setDescription(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Description EN* </label>
                            <Form.Control
                              defaultValue={descriptionEn}
                              placeholder="Description EN"
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
                            <label>Description AR* </label>
                            <Form.Control
                              defaultValue={descriptionAr}
                              placeholder="Description AR"
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

export default AjouterAge;

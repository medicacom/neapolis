import React, { useEffect,useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory} from "react-router-dom";
import { paysAdded, paysGetById } from "../../../Redux/paysReduce";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-multi-lang";
import { toast, ToastContainer } from "react-toastify";

function AjouterPays({ onlineStatus }) {
  const t = useTranslation();
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
  const [id, setId] = React.useState(0);
  const [alpha2, setAlpha2] = React.useState("");
  const [alpha3, setAlpha3] = React.useState("");
  const [nomEn, setNomEn] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [code, setCode] = React.useState("");
  function submitForm() {
    dispatch(paysAdded({ code, nom, nomEn, alpha2, alpha3, id }));
    if (isNaN(location.id) === true) {
      notify(1, t("add_txt"));
    } else {
      notify(1, t("update_txt"));
    }
  }

  useEffect(() => {
    async function getPays() {
      if (isNaN(location.id) === false) {
        var pays = await dispatch(paysGetById(location.id));
        var entities = pays.payload;
        if(entities === false){
          navigate('/paysList');
        } 
        else {
          setNom(entities.nom);
          setAlpha2(entities.alpha2);
          setAlpha3(entities.alpha3);
          setCode(entities.code);
          setNomEn(entities.nom_en);
          setId(location.id);
        }
      }
    }
    getPays();
  }, [location.id,dispatch,navigate]);

  function listePays() {
    navigate.push('/paysList');
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
                  onClick={listePays}
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
                            ? t("pays.add")
                            : t("pays.update")}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("pays.nom")} * </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder={t("pays.nom")}
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("pays.nom_en")}* </label>
                            <Form.Control
                              defaultValue={nomEn}
                              placeholder={t("pays.nom_en")}
                              type="text"
                              onChange={(value) => {
                                setNomEn(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("pays.alpha2")} * </label>
                            <Form.Control
                              defaultValue={alpha2}
                              placeholder={t("pays.alpha2")}
                              type="text"
                              onChange={(value) => {
                                setAlpha2(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("pays.alpha3")} * </label>
                            <Form.Control
                              defaultValue={alpha3}
                              placeholder={t("pays.alpha3")}
                              type="text"
                              onChange={(value) => {
                                setAlpha3(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("pays.code")} * </label>
                            <Form.Control
                              defaultValue={code}
                              placeholder={t("pays.code")}
                              type="text"
                              onChange={(value) => {
                                setCode(value.target.value);
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

export default AjouterPays;

import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-multi-lang";

function Medicament(props) {
  const t = useTranslation();
  return (
    <>
      <Container fluid>
        <div className="section-declaration">
          <Container>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.name_drug")} *</label>
                            <Select
                              placeholder={t("select")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.medicament}
                              onChange={(value) => {
                                props.setMedicament(value);
                                localStorage.setItem("idMedicament",value.value);
                                localStorage.setItem("medicament",value.label);
                              }}
                              options={props.optionsMedicament}
                            />
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.numero")}* </label>
                            <Form.Control
                              defaultValue={props.numero}
                              placeholder={t("Declaration.numero")}
                              name="Numero"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setNumero(value.target.value);
                                localStorage.setItem("numero",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.dosage")}* </label>
                            <Form.Control
                              defaultValue={props.posologie}
                              placeholder={t("Declaration.dosage")}
                              name="Posologie"
                              className="required"
                              type="number"
                              onChange={(value) => {
                                props.setPosologie(value.target.value);
                                localStorage.setItem("posologie",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.voice_txt")} ? *</label>
                            <Select
                              placeholder="--Choissisez dans cette liste --"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.voix}
                              onChange={(value) => {
                                props.setVoix(value);
                                localStorage.setItem("idVoix",value.value);
                                localStorage.setItem("voix",value.label);
                              }}
                              options={props.optionsVoix}
                            />
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.txt_date")} </label>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>{t("Declaration.start")} </label>
                            <Form.Control
                              defaultValue={props.dateDebutAdmin}
                              className="required"
                              type="date"
                              onChange={(value) => {
                                props.setDateDebutAdmin(value.target.value);
                                localStorage.setItem("dateDebutAdmin",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>{t("Declaration.end")} </label>
                            <Form.Control
                              defaultValue={props.dateFinAdmin}
                              type="date"
                              onChange={(value) => {
                                props.setDateFinAdmin(value.target.value);
                                localStorage.setItem("dateFinAdmin",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.date_admin")}</label>
                            <Form.Control
                              defaultValue={props.date_admin}
                              name="date_admin"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setDate_admin(value.target.value);
                                localStorage.setItem("date_admin",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.therapeutique")}</label>
                            <Form.Control
                              defaultValue={props.therapeutique}
                              name="therapeutique"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setTherapeutique(value.target.value);
                                localStorage.setItem("therapeutique",value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.effects")} *</label>
                            <Form.Control
                              defaultValue={props.effet}
                              name="effet"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setEffet(value.target.value);
                                localStorage.setItem("effet",value.target.value);
                              }}
                            ></Form.Control>
                            {/* <Select
                              placeholder={t("select")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.effet}
                              onChange={(value) => {
                                props.setEffet(value);
                              }}
                              options={props.optionsEffet}
                            /> */}
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
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

export default Medicament;

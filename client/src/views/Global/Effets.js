import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-multi-lang";

function Step3(props) {
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
                            <label>{t("Declaration.effects")} *</label>
                            <Select
                              placeholder={t("select")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.effet}
                              onChange={(value) => {
                                props.setEffet(value);
                              }}
                              options={props.optionsEffet}
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
                              defaultValue={props.dateDebut}
                              name="Email"
                              className="required"
                              type="date"
                              onChange={(value) => {
                                props.setDateDebut(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>{t("Declaration.end")} </label>
                            <Form.Control
                              defaultValue={props.dateFin}
                              type="date"
                              onChange={(value) => {
                                props.setDateFin(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>
                              {t("Declaration.text1")}
                            </label>
                            <Form.Control
                              defaultValue={props.information}
                              name="description"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setInformation(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>
                              {t("Declaration.text2")}
                            </label>
                            <Form.Control
                              defaultValue={props.complementaires}
                              name="complementaires"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setComplementaires(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
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

export default Step3;

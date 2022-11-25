import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

function Step3(props) {
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
                            <label>
                              Description des effets indésirables *
                            </label>
                            <Select
                              placeholder="--Choissisez dans cette liste --"
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
                          <label>Début et fin des effets indésirables </label>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>Date de début </label>
                            <Form.Control
                              defaultValue={props.dateDebut}
                              placeholder="Date de début"
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
                            <label>Date de fin </label>
                            <Form.Control
                              defaultValue={props.dateFin}
                              placeholder="Date de fin"
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
                              Si vous ne connaissez pas la date exacte de début
                              et/ou de fin des effets indésirables, vous pouvez
                              donner plus d’information sur la relation
                              temporelle ici. Veuillez le préciser pour chaque
                              effet indésirable.
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
                              Examens complémentaires Si des tests ont été
                              effectués,mentionnez également les résultats. Il
                              peut s’agir d’analyses sanguines, d’une imagerie
                              médicale, d’une biopsie ...
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

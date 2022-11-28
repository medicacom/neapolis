import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

function Step4(props) {
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
                              Nom du médicament suspecté *
                            </label>
                            <Select
                              placeholder="--Choissisez dans cette liste --"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.medicament}
                              onChange={(value) => {
                                props.setMedicament(value);
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
                            <label>Numéro du lot* </label>
                            <Form.Control
                              defaultValue={props.numero}
                              placeholder="Numéro du lot"
                              name="Numero"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setNumero(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>Posologie* </label>
                            <Form.Control
                              defaultValue={props.posologie}
                              placeholder="Posologie"
                              name="Posologie"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setPosologie(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>
                              Comment le médicament a-t-il été administré ? *
                            </label>
                            <Select
                              placeholder="--Choissisez dans cette liste --"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.voix}
                              onChange={(value) => {
                                props.setVoix(value);
                              }}
                              options={props.optionsVoix}
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
                              defaultValue={props.dateDebutAdmin}
                              placeholder="Date de début"
                              name="Email"
                              className="required"
                              type="date"
                              onChange={(value) => {
                                props.setDateDebutAdmin(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="6">
                          <Form.Group>
                            <label>Date de fin </label>
                            <Form.Control
                              defaultValue={props.dateFinAdmin}
                              placeholder="Date de fin"
                              type="date"
                              onChange={(value) => {
                                props.setDateFinAdmin(value.target.value);
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

export default Step4;

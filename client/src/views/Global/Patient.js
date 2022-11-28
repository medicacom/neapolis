import React, {  } from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

function Step2(props) {
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
                            <label>Initiales* </label>
                            <Form.Control
                              defaultValue={props.initiales}
                              placeholder="Nom"
                              name="Nom"
                              className="required"
                              type="text"
                              onBlur={(value) => {
                                props.setInitiales(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col md="12">
                          <label>Sexe* </label>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe ===1?true:false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={()=>props.setSexe(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Homme
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe ===2?true:false}
                                defaultValue="option2"
                                name="sexeRadio"
                                type="radio"
                                onClick={()=>props.setSexe(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Femme
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe ===3?true:false}
                                defaultValue="option2"
                                name="sexeRadio"
                                type="radio"
                                onClick={()=>props.setSexe(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              X
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <label>Age du patient* </label>
                        </Col>
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age ===1?true:false}
                                defaultValue="1"
                                name="ageRadio"
                                type="radio"
                                onClick={()=>props.setAge(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Date de naissance
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age ===1?
                          <Col md="12">
                            <Form.Group>
                              <Form.Control
                                defaultValue={props.dateNaissance}
                                placeholder="Nom"
                                name="Nom"
                                className="required"
                                type="date"
                                onChange={(value) => {
                                  props.setDateNaissance(value.target.value);
                                }}
                              ></Form.Control>
                            </Form.Group>
                            <div className="error"></div>
                          </Col>
                        :""}
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age ===2?true:false}
                                defaultValue="2"
                                name="ageRadio"
                                type="radio"
                                onClick={()=>props.setAge(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Age
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age ===2?
                          <Col md="12">
                            <Form.Group>
                              <Form.Control
                                defaultValue={props.agePatient}
                                placeholder="Age Patient"
                                name="agePatient"
                                className="required"
                                type="text"
                                onBlur={(value) => {
                                  props.setAgePatient(value.target.value);
                                }}
                              ></Form.Control>
                            </Form.Group>
                            <div className="error"></div>
                          </Col>
                        :""}
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age ===3?true:false}
                                defaultValue="3"
                                name="ageRadio"
                                type="radio"
                                onClick={()=>props.setAge(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Catégorie d'age
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age ===3?
                          <Col md="12">
                            <Select
                              placeholder="Catégorie d'age"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.ageCategorie}
                              onChange={(value) => {
                                props.setAgeCategorie(value);
                              }}
                              options={props.optionsAge}
                            />
                          </Col>
                        :""}

                      </Row>
                      <Row>
                        <Col md="12">
                          <label>Dans le cas d’un nouveau -né ou d’un nourrisson, indiquez si le médicament a été administré à/au* </label>
                          <Select
                            placeholder="--Choissisez dans cette liste --"
                            className="react-select primary"
                            classNamePrefix="react-select"
                            defaultValue={props.indication}
                            onChange={(value) => {
                              props.setIndication(value);
                            }}
                            options={props.optionsIndication}
                          />
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

export default Step2;

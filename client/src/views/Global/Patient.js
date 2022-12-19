import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-multi-lang";

function Patient(props) {
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
                            <label>{t("Declaration.initials")}* </label>
                            <Form.Control
                              defaultValue={props.initiales}
                              placeholder={t("Declaration.initials_place")}
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
                          <label>{t("Declaration.gendre")}* </label>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe === 1 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setSexe(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.man")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe === 2 ? true : false}
                                defaultValue="option2"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setSexe(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.woman")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.sexe === 3 ? true : false}
                                defaultValue="option2"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setSexe(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.other")}
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.age")}* </label>
                        </Col>
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age === 1 ? true : false}
                                defaultValue="1"
                                name="ageRadio"
                                type="radio"
                                onClick={() => props.setAge(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.date")}
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age === 1 ? (
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
                        ) : (
                          ""
                        )}
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age === 2 ? true : false}
                                defaultValue="2"
                                name="ageRadio"
                                type="radio"
                                onClick={() => props.setAge(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              Age
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age === 2 ? (
                          <Col md="12">
                            <Form.Group>
                              <Form.Control
                                defaultValue={props.agePatient}
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
                        ) : (
                          ""
                        )}
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.age === 3 ? true : false}
                                defaultValue="3"
                                name="ageRadio"
                                type="radio"
                                onClick={() => props.setAge(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.category")}
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                        {props.age === 3 ? (
                          <Col md="12">
                            <Select
                              placeholder={t("Declaration.category")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.ageCategorie}
                              onChange={(value) => {
                                props.setAgeCategorie(value);
                              }}
                              options={props.optionsAge}
                            />
                          </Col>
                        ) : (
                          ""
                        )}
                      </Row>
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.txt_indication")} </label>
                          <Select
                            placeholder={t("select")}
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
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.poid")} </label>
                          <Form.Group>
                            <Form.Control
                              placeholder={t("Declaration.poid_place")}
                              defaultValue={props.poid}
                              name="agePatient"
                              className="required"
                              type="number"
                              onBlur={(value) => {
                                props.setPoid(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.taille")} </label>
                          <Form.Group>
                            <Form.Control
                              placeholder={t("Declaration.taille_place")}
                              defaultValue={props.taille}
                              name="agePatient"
                              className="required"
                              type="number"
                              onBlur={(value) => {
                                props.setTaille(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("Declaration.allergie")}</label>
                            <Form.Control
                              defaultValue={props.allergie}
                              name="complementaires"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setAllergie(value.target.value);
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

export default Patient;

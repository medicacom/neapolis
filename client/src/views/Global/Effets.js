import React from "react";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-multi-lang";

function Effets(props) {
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
                            <label>{t("Declaration.description_eff")} *</label>
                            <Form.Control
                              defaultValue={props.description_eff}
                              name="therapeutique"
                              as="textarea"
                              rows="3"
                              onChange={(value) => {
                                props.setDescription_eff(value.target.value);
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
                            <label>{t("Declaration.text1")}</label>
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
                            <label>{t("Declaration.text2")}</label>
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
                      {/* Quel est (était) le niveau de gravité des effets indésirables ? */}
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.gravite")}</label>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={props.grave === 1 ? true : false}
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked) props.setGrave(1);
                                    else props.setGrave(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.grave")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={
                                    props.hospitalisation === 1 ? true : false
                                  }
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked)
                                      props.setHospitalisation(1);
                                    else props.setHospitalisation(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.hospitalisation")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={props.pronostic === 1 ? true : false}
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked)
                                      props.setPronostic(1);
                                    else props.setPronostic(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.pronostic")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={props.deces === 1 ? true : false}
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked) props.setDeces(1);
                                    else props.setDeces(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.deces")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={
                                    props.incapacite === 1 ? true : false
                                  }
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked)
                                      props.setIncapacite(1);
                                    else props.setIncapacite(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.incapacite")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={props.anomalie === 1 ? true : false}
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked)
                                      props.setAnomalie(1);
                                    else props.setAnomalie(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.anomalie")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  checked={props.autre === 1 ? true : false}
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked) props.setAutre(1);
                                    else props.setAutre(0);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                {t("Declaration.autre")}
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Les effets indésirables ont-ils été traités ? */}
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.traites")}* </label>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.traites === 1 ? true : false}
                                defaultValue="option1"
                                name="traites"
                                type="radio"
                                onClick={() => props.setTraites(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.traites_yes")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.traites === 2 ? true : false}
                                defaultValue="option2"
                                name="traites"
                                type="radio"
                                onClick={() => props.setTraites(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.traites_no")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.traites === 3 ? true : false}
                                defaultValue="option2"
                                name="traites"
                                type="radio"
                                onClick={() => props.setTraites(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.traites_inc")}
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>
                       {/* Évolution */}
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.evolution")}* </label>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 1 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt1")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 2 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt2")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 3 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt3")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 4 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(4)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt4")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 5 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(5)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt5")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.evolution === 6 ? true : false}
                                defaultValue="option1"
                                name="sexeRadio"
                                type="radio"
                                onClick={() => props.setEvolution(6)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.evolution_txt6")}
                            </Form.Check.Label>
                          </Form.Check>
                        </Col>
                      </Row>
                       {/* Les effets indésirables sont-ils survenus, selon vous, dans l’une des situations suivantes ? */}
                      <Row>
                        <Col md="12">
                          <label>{t("Declaration.survenus")}* </label>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 1 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(1)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt1")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 2 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(2)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt2")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 3 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(3)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt3")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 4 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(4)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt4")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 5 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(5)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt5")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.survenus === 6 ? true : false}
                                defaultValue="option1"
                                name="survenus"
                                type="radio"
                                onClick={() => props.setSurvenus(6)}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("Declaration.survenus_txt6")}
                            </Form.Check.Label>
                          </Form.Check>
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

export default Effets;

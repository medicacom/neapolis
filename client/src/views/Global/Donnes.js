import React, { useEffect, useCallback } from "react";
import Select from "react-select";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchSpecialite } from "../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-multi-lang";

function Donnes(props) {
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  const dispatch = useDispatch();
  const location = useParams();
  //input

  const [optionsSpecialite, setOptionsSpecialite] = React.useState([
    {
      value: "",
      label: "Specialite",
      isDisabled: true,
    },
  ]);

  /** start Specialite **/
  const getSpecialite = useCallback(async () => {
    var role = await dispatch(fetchSpecialite());
    var entities = role.payload;
    var arrayOption = [];
    var label =
      lang === "fr" ? "Specialite" : lang === "en" ? "Speciality" : "تخصص";
    arrayOption.push({ value: 0, label: label });
    entities.forEach((e) => {
      var nomSp =
        lang === "fr" ? e.nom : lang === e.nom_en ? "Speciality" : e.nom_ar;
      arrayOption.push({ value: e.id, label: nomSp });
    });
    setOptionsSpecialite(arrayOption);
  }, [dispatch]);
  /** end Specialite **/

  useEffect(() => {
    getSpecialite();
  }, [location.id, getSpecialite]);

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
                            <label>{t("User.name")} * </label>
                            <Form.Control
                              defaultValue={props.nom}
                              placeholder={t("User.name")}
                              name="Nom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.last_name")}* </label>
                            <Form.Control
                              defaultValue={props.prenom}
                              placeholder={t("User.last_name")}
                              name="Prenom"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setPrenom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.email")}* </label>
                            <Form.Control
                              defaultValue={props.email}
                              placeholder={t("User.email")}
                              name="Email"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                props.setEmail(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="12">
                          <Form.Group>
                            <label>{t("User.tel")} </label>
                            <Form.Control
                              defaultValue={props.tel}
                              placeholder={t("User.tel")}
                              type="number"
                              onChange={(value) => {
                                props.setTel(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* <Row>
                        <Col md="12">
                          <Form.Group id="roleClass">
                            <label>{t("User.specialite")} </label>
                            <Select
                              placeholder={t("User.specialite")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              defaultValue={props.specialite}
                              onChange={(value) => {
                                props.setSpecialite(value);
                              }}
                              options={optionsSpecialite}
                            />
                          </Form.Group>
                        </Col>
                      </Row> */}

                      <Row>
                        <Col md="12">
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.typeSpecialite === 1 ? true : false}
                                defaultValue="1"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setIdSpecialite(0);
                                  props.setTypeSpecialite(1);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("doctor")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.typeSpecialite === 2 ? true : false}
                                defaultValue="2"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setIdSpecialite(102);
                                  props.setTypeSpecialite(2);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("pharmacist")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.typeSpecialite === 3 ? true : false}
                                defaultValue="3"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setTypeSpecialite(3);
                                  props.setIdSpecialite(121);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("technician")}
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check className="form-check-radio">
                            <Form.Check.Label>
                              <Form.Check.Input
                                checked={props.typeSpecialite === 4 ? true : false}
                                defaultValue="4"
                                name="ageRadio"
                                type="radio"
                                onClick={() => {
                                  props.setTypeSpecialite(4);
                                  props.setIdSpecialite(120);
                                }}
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                              {t("other")}
                            </Form.Check.Label>
                          </Form.Check>
                          {props.typeSpecialite === 1 ? (
                            <Form.Group>
                              <Select
                                placeholder={t("User.specialite")}
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={props.specialite}
                                onChange={(value) => {
                                  props.setSpecialite(value);
                                  props.setIdSpecialite(value.value);
                                }}
                                options={optionsSpecialite}
                              />
                            </Form.Group>
                          ) : props.typeSpecialite === 4 ? (
                            <Form.Group>
                              <Form.Control
                                placeholder={t("other")}
                                type="text"
                                onBlur={(value) => {
                                  props.setAutreSp(value.target.value);
                                }}
                              ></Form.Control>
                            </Form.Group>
                          ) : (
                            ""
                          )}
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

export default Donnes;

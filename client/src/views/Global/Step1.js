import React, { useEffect, useCallback } from "react";
import Select from "react-select";
// react-bootstrap components
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchSpecialite } from "../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";

function Step1(props) {
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
    arrayOption.push({ value: 0, label: "Specialite" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionsSpecialite(arrayOption);
  }, [dispatch]);

  /** end Gouvernorat **/

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
                            <label>Nom * </label>
                            <Form.Control
                              defaultValue={props.nom}
                              placeholder="Nom"
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
                            <label>Prenom* </label>
                            <Form.Control
                              defaultValue={props.prenom}
                              placeholder="Prenom"
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
                            <label>E-mail* </label>
                            <Form.Control
                              defaultValue={props.email}
                              placeholder="E-mail"
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
                            <label>Téléphone </label>
                            <Form.Control
                              defaultValue={props.tel}
                              placeholder="Téléphone"
                              type="number"
                              onChange={(value) => {
                                props.setTel(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <Form.Group id="roleClass">
                            <label>Specialite </label>
                            <Select
                              placeholder="Specialite"
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

export default Step1;

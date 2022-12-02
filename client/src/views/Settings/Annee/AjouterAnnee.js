import React, { useEffect, useCallback } from "react";
import Select from "react-select";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { anneeAdded, anneeGetById } from "../../../Redux/anneeReduce";

import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";

function AjouterAnnee() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useHistory();
  if (isNaN(location.id) === true) document.title = "Ajouter annee";
  else document.title = "Modifier le annee";

  /* const [option] = React.useState([
    {
      value: "",
      label: "Année",
      isDisabled: true,
    },
    {
      value: 0,
      label: "Non",
    },
    {
      value: 1,
      label: "Oui",
    },
  ]); */
  const [selected, setSelected] = React.useState({
    value: 0,
    label: "Non",
  });
  const [annee, setAnnee] = React.useState("");
  const [id, setId] = React.useState(0);

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
  function submitForm(event) {
    dispatch(anneeAdded({ annee: annee, id: id, selected: selected.value }));
    if (isNaN(location.id) === true) notify(1, "Insertion avec succes");
    else notify(1, "Modifier avec succes");
  }

  useEffect(() => {
    async function getAnnee() {
      if (isNaN(location.id) === false) {
        var annee = await dispatch(anneeGetById(location.id));
        var entities = annee.payload;
        if (entities === false) {
          listeAnnee();
        } else {
          setAnnee(entities.annee);
          if (entities.selected === 0)
            setSelected({
              value: 0,
              label: "Non",
            });
          else
            setSelected({
              value: 1,
              label: "Oui",
            });
          setId(location.id);
        }
      }
    }
    getAnnee();
  }, [location.id, dispatch, navigate]);

  function listeAnnee() {
    navigate.push("/listAnnee");
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
                  onClick={listeAnnee}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  Retour à la liste
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
                            ? "Ajouter annee"
                            : "Modifier annee"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Annee * </label>
                            <Form.Control
                              defaultValue={annee}
                              placeholder="Annee"
                              type="text"
                              onChange={(value) => {
                                setAnnee(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        {/* <Col className="pr-1" md="6">
                          <label>Annee selectionner* </label>
                          <Select
                            placeholder="Utilisateur"
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={selected}
                            onChange={(value) => {
                              setSelected(value);
                            }}
                            options={option}
                          />
                        </Col> */}
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="success"
                        onClick={submitForm}
                      >
                        Enregistrer
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

export default AjouterAnnee;

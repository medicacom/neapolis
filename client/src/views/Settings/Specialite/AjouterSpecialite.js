import React, { useEffect,useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { specialiteAdded, specialiteGetById } from "../../../Redux/specialiteReduce";
import { verification } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-multi-lang";

function AjouterSpecialite() {
  const t = useTranslation();
  const dispatch = useDispatch();
  const location = useParams();
  if (isNaN(location.id) === true) document.title = "Ajouter un specialite";
  else  document.title = "Modifier le specialite";
  const [nom, setNom] = React.useState("");
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
    if(nom === "")      
      notify(2, "Ligne Ims est obligatoire");   
    else {
      dispatch(specialiteAdded({ nom, id }));
      if(isNaN(location.id) === true)
        notify(1, t("add_txt"))
      else  
        notify(1, t("update_txt"));
    }
  }

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  useEffect(() => {
    async function getSpecialite() {
      if (isNaN(location.id) === false) {
        var specialite = await dispatch(specialiteGetById(location.id));
        var entities = specialite.payload;
        setNom(entities.nom);
        setId(location.id);
      }
    }
    verifToken();
    getSpecialite();
  }, [location.id,dispatch,verifToken]);

  function listeSpecialite() {
    window.location.replace("/listSpecialite");
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
                  variant="info"
                  onClick={listeSpecialite}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  {t("list")}
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
                          { typeof location.id == "undefined" ? t("speciality.add") : t("speciality.update") }
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("name")}* </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder={t("name")}
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="info"
                        onClick={submitForm}
                      >
                        {t("save")}
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

export default AjouterSpecialite;

import React, { useEffect,useCallback } from "react";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { settingsUpdated, getSettings } from "../Redux/settingsReduce";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import { verification } from "../Redux/usersReduce";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
function Settings() {
  const dispatch = useDispatch(); 
  const location = useParams();
  //input
  const [icon, setIcon] = React.useState(null);
  const [iconUrl, setIconUrl] = React.useState("");
  const [iconBD, setIconBD] = React.useState(false);
  const [logo, setLogo] = React.useState("");
  const [logoBD, setLogoBD] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState("");
  const [name, setName] = React.useState("");

  function submitForm() {
    const dataArray = new FormData();
    dataArray.append("image", logo);
    dataArray.append("name", logo.name);
    const iconArray = new FormData();
    iconArray.append("icon", icon);
    iconArray.append("iconname", "favicon.ico");
    var settingsObj = {icon:"favicon.ico",logo:logo.name,name:name}
    dispatch(settingsUpdated({ dataArray, iconArray,settingsObj }));
  }

  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        var Settings = await dispatch(getSettings(1));
        var entities = await Settings.payload;
        resolve(entities);
      }, 200);
    });

    promise.then((value) => {
        setName(value.name)
        setLogo(value.logo)
        setIcon(value.icon)
        setLogoBD(true)
        setIconBD(true)
    });
  }, [location.id, dispatch]);

  const uploadIcon= (acceptedFiles) => {
    setIconBD(false)
    setIcon(acceptedFiles[0]);
    setIconUrl(URL.createObjectURL(acceptedFiles[0]));
  } 

  const uploadLogo = (acceptedFiles) => {
    setLogoBD(false)
    setLogo(acceptedFiles[0]);
    setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
  };
  return (
    <>
      <Container fluid>
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">Paramètre d'application</Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Title* </label>
                            <Form.Control
                              defaultValue={name}
                              placeholder="Title"
                              name="Title"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setName(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <div className="App">
                            <Dropzone onDrop={uploadLogo}>
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps({
                                    className: "dropzone",
                                  })}
                                >
                                  <input {...getInputProps()} />                            
                                  <p>
                                    {logoUrl !==""?<img src={logoUrl} className="imgUpload" alt="imgUpload" /> : 
                                    logoBD !== false && logo!=="" ? <img src={require("../assets/img/"+logo)} alt="imgUpload" className="imgUpload" />:
                                      "Il y a aucun logo selectionner"} 
                                  </p>
                                  <p>Choisissez un logo</p>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        </Col>
                        <Col className="pr-1" md="6">
                          <div className="App">
                            <Dropzone onDrop={uploadIcon} accept="image/x-icon">
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps({
                                    className: "dropzone",
                                  })}
                                >
                                  <input {...getInputProps()} />
                                  <p>
                                    {iconUrl !== "" ? 
                                      <img src={iconUrl} className="iconeUpload" alt="iconeUpload"/>:
                                      iconBD !== false && icon !==""? <img src={require("../assets/img/"+icon)} alt="iconeUpload" className="iconeUpload" />:
                                      "Il y a aucun icone selectionner"} 
                                  </p>
                                  <p>Choisissez une icône</p>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        </Col>
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

export default Settings;

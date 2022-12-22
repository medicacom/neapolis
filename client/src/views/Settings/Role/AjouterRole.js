import React, { useEffect, useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { roleAdded, roleGetById } from "../../../Redux/roleReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
import { useTranslation } from "react-multi-lang";
function AjouterRole({ onlineStatus }) {
  const t = useTranslation();
  let db;
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
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useHistory();
  const [nom, setNom] = React.useState("");
  const [role, setRole] = React.useState(0);
  const [order] = React.useState(0);
  const [id, setId] = React.useState(0);

  async function saveRoleIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("roles", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objRole = { ...cursor.value };
        objRole.order = order;
        objRole.nom = nom;
        objRole.role = role;
        objRole.updated = 1;
        cursor.update(objRole);
      }
      await tx.done;
      notify(1, t("update_txt"));
    } else {
      let rolesStore = tx.objectStore("roles");
      let roles = await rolesStore.getAll();
      await tx.objectStore("roles").add({
        nom: nom,
        order: order,
        role: role,
        type_table: 2,
        saved: 0,
        id: roles[roles.length - 1].id + 1,
      });
      notify(1, t("add_txt"));
    }

    setTimeout(async () => {
      listeRole();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      if (nom !== "" && role !== 0) {
        dispatch(roleAdded({ nom, order, role, id }));
        if (isNaN(location.id) === true) {
          notify(1, t("add_txt"));
        } else {
          notify(1, t("update_txt"));
        }
      } else {
        notify(2, t("erreur"));
      }
    } else {
      if (nom !== "" && role !== 0) {
        saveRoleIndex();
      } else {
        notify(2, t("erreur"));
      }
    }

    setTimeout(async () => {
      listeRole();
    }, 1500);
  }

  async function initRole() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("roles", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objRole = { ...cursor.value };
      setNom(objRole.nom);
      setRole(objRole.role);
      setId(objRole);
    }
    await tx.done;
  }

  useEffect(() => {
    async function getRole() {
      if (isNaN(location.id) === false) {
        var role = await dispatch(roleGetById(location.id));
        var entities = role.payload;
        setNom(entities.nom);
        setRole(entities.role);
        setId(location.id);
      }
    }
    if (onlineStatus === 1) getRole();
    else {
      if (isNaN(location.id) === false) initRole();
    }
  }, [location.id, dispatch]);

  function listeRole() {
    navigate.push("/roleList");
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
                  onClick={listeRole}
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
                          {typeof location.id == "undefined"
                            ? t("role.add")
                            : t("role.update")}
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
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Groupe * </label>
                            <Form.Control
                              defaultValue={role}
                              placeholder={"Groupe"}
                              type="text"
                              onChange={(value) => {
                                setRole(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="success"
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

export default AjouterRole;

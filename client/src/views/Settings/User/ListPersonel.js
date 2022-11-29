import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  getPersonnel,
  userChangeEtat,
  validationUser,
} from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb";

// core components
function ListPersonel({ onlineStatus }) {
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
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [entitiesNo, setEntitiesNo] = React.useState([]);
  const [columns] = React.useState([
    //column definitions...
    {
      header: "Nom",
      accessorKey: "nom",
    },
    {
      header: "Prenom",
      accessorKey: "prenom",
    },
    {
      header: "Login",
      accessorKey: "login",
    },
    {
      header: "Role",
      accessorKey: "role",
      Cell: ({ cell }) =>
        onlineStatus === 1
          ? cell.row.original.roles.nom
          : cell.row.original.nom_role,
    },
    {
      header: "E-mail",
      accessorKey: "email",
    },
    {
      header: "Etat",
      accessorKey: "etat",
      Cell: ({ cell }) =>
        cell.row.original.etat === 1 ? "Activé" : "Désactivé",
    },
    {
      accessorKey: "id",
      header: "actions",
      Cell: ({ cell, row }) => (
        <div className="actions-right block_action">
          <Button
            onClick={() => {
              navigate.push("/utilisateur/update/" + cell.row.original.id);
            }}
            variant="warning"
            size="sm"
            className="text-warning btn-link edit"
          >
            <i className="fa fa-edit" />
          </Button>
          <Button
            onClick={(event) => {
              changeEtat(cell.row.original.id, cell.row.original.etat);
            }}
            variant="danger"
            size="sm"
            className={
              cell.row.original.etat === 1
                ? "text-success btn-link delete"
                : "text-danger btn-link delete"
            }
          >
            <i
              className={
                cell.row.original.etat === 1 ? "fa fa-check" : "fa fa-times"
              }
            />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "valider",
      header: "Validation",
      Cell: ({ cell, row }) =>
        cell.row.original.valider === 0 ? (
          <div className="actions-right block_action">
            <Button
              onClick={(event) => {
                valideEtat(cell.row.original, 1);
              }}
              variant="success"
              size="sm"
            >
              Valider <i className={"fa fa-check"} />
            </Button>
            <Button
              onClick={(event) => {
                valideEtat(cell.row.original, 2);
              }}
              variant="danger"
              size="sm"
              className={"btn-danger"}
            >
              Refuser <i className={"fa fa-times"} />
            </Button>
          </div>
        ) : (
          ""
        ),
    },
    //end
  ]);
  function ajouter() {
    navigate.push("/ajouterUtilisateur");
  }

  async function updateUser(id, etat) {
    const tx = db.transaction("users", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(id))) {
      var objRole = { ...cursor.value };
      switch (etat) {
        case 0:
          objRole.etat = 1;
          notify(1, "Activer avec succes");
          break;
        case 1:
          objRole.etat = 0;
          notify(1, "Désactiver avec succes");
          break;
        default:
          break;
      }

      objRole.updated = 1;
      cursor.update(objRole);
    }
    await tx.done;
    initUser();
  }

  function changeEtat(id, e) {
    /* setEntities([]); */
    if (onlineStatus === 1) {
      dispatch(userChangeEtat(id)).then((e1) => {
        getUser();
        switch (e) {
          case 0:
            notify(1, "Activer avec succes");
            break;
          case 1:
            notify(1, "Désactiver avec succes");
            break;
          default:
            break;
        }
      });
    } else {
      updateUser(id, e);
    }
  }

  function valideEtat(ligne, etat) {
    dispatch(
      validationUser({
        id: ligne.id,
        valider: etat,
        email: ligne.email,
        nom: ligne.nom + " " + ligne.prenom,
      })
    );
  }

  //storeUsers
  const storeUsers = useCallback(
    async (resUsers) => {
      const tx = db.transaction("users", "readwrite");
      for (let index = 0; index < resUsers.length; index++) {
        await tx.objectStore("users").add({
          id: resUsers[index].id,
          nom: resUsers[index].nom,
          prenom: resUsers[index].prenom,
          login: resUsers[index].login,
          email: resUsers[index].email,
          id_role: resUsers[index].id_role,
          tel: resUsers[index].tel,
          nom_role: resUsers[index].roles.nom,
          etat: resUsers[index].etat,
          password: resUsers[index].password,
          token: resUsers[index].token,
          code: resUsers[index].code,
          saved: 1,
          type_table: 3,
          updated: 0,
        });
      }
    },
    [dispatch]
  );

  async function clearUsers(resUsers) {
    let tx = db.transaction("users", "readwrite");
    await tx.objectStore("users").clear();
    storeUsers(resUsers);
  }

  const getUser = useCallback(async () => {
    var response = await dispatch(getPersonnel());
    var resUsers = await response.payload.findValider;
    var findNonValider = await response.payload.findNonValider;
    setEntities(resUsers);
    setEntitiesNo(findNonValider);
    clearUsers(resUsers);
  }, [dispatch]);

  async function initUser() {
    const tx = db.transaction("users", "readwrite");
    let store = tx.objectStore("users");
    let users = await store.getAll();
    setEntities(users);
  }

  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getUser();
    else {
      initUser();
    }
  }

  useEffect(() => {
    /* getUser(); */
    init();
  }, []);

  function ListTable({ list }) {
    return (
      <MaterialReactTable
        columns={columns}
        data={list}
        enableColumnActions={true}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: false }}
      />
    );
  }
  return (
    <>
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un personnel de santé
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des personnel de santés non valider</h4>
            <Card className="card-header">
              <Card.Body>
                <ListTable list={entitiesNo}></ListTable>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des personnel de santés valider</h4>
            <Card className="card-header">
              <Card.Body>
                <ListTable list={entities}></ListTable>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListPersonel;

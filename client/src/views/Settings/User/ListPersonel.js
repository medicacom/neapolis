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
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
function ListPersonel({ onlineStatus }) {
  let lang = window.localStorage.getItem("lang");
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
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const [entitiesNo, setEntitiesNo] = React.useState([]);
  const [columns] = React.useState([
    //column definitions...
    {
      header: t("User.name"),
      accessorKey: "nom",
    },
    {
      header: t("User.last_name"),
      accessorKey: "prenom",
    },
    {
      header: t("User.role"),
      accessorKey: "role",
      Cell: ({ cell }) =>
        onlineStatus === 1
          ? cell.row.original.roles.nom
          : cell.row.original.nom_role,
    },
    {
      header: t("User.email"),
      accessorKey: "email",
    },
    {
      header: t("state"),
      accessorKey: "etat",
      Cell: ({ cell }) =>
        cell.row.original.etat === 1 ? t("enabled") : t("disabled"),
    },
    /* {
      header: t("actions"),
      accessorKey: "id",
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
    }, */
    {
      header: t("User.validation"),
      accessorKey: "valider",
      Cell: ({ cell, row }) =>
        cell.row.original.valider === 0 ? (
          <div className="actions-right block_action">
            <Button
              onClick={(event) => {
                confirmMessage(cell.row.original, 1);
              }}
              variant="success"
              size="sm"
            >
              {t("validate")} <i className={"fa fa-check"} />
            </Button>
            <br></br>
            <Button
              onClick={(event) => {
                confirmMessage(cell.row.original, 2);
              }}
              variant="danger"
              size="sm"
              className={"btn-danger"}
            >
              {t("refuse")} <i className={"fa fa-times"} />
            </Button>
          </div>
        ) : (
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
    //end
  ]);

  const confirmMessage = (ligne, e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={
          e === 1
            ? "Vous éte sure de valider ce utilisateur?"
            : "Vous éte sure de refuser ce utilisateur?"
        }
        onConfirm={() => valideEtat(ligne, e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function ajouter() {
    navigate.push("/ajouterUtilisateur");
  }

  const hideAlert = () => {
    setAlert(null);
  };

  function changeEtat(id, e) {
    /* setEntities([]); */
    if (onlineStatus === 1) {
      dispatch(userChangeEtat(id)).then((e1) => {
        getUser();
        switch (e) {
          case 0:
            notify(1, t("enable"));
            break;
          case 1:
            notify(1, t("disable"));
            break;
          default:
            break;
        }
      });
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
    ).then((e1) => {
      hideAlert();
      getUser();
      switch (etat) {
        case 1:
          notify(1, t("validate"));
          break;
        case 2:
          notify(1, t("refuse"));
          break;
        default:
          break;
      }
    });
  }

  //storeUsers
  const storeUsers = useCallback(
    async (resUsers) => {
      const tx = db.transaction("personels", "readwrite");
      for (let index = 0; index < resUsers.length; index++) {
        await tx.objectStore("personels").add({
          id: resUsers[index].id,
          nom: resUsers[index].nom,
          prenom: resUsers[index].prenom,
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
          valider: resUsers[index].valider,
          id_gouvernorat: resUsers[index].id_role,
          nom_gouvernorat: resUsers[index].gouvernorats.libelle+"@@"+resUsers[index].gouvernorats.libelle_en+"@@"+resUsers[index].gouvernorats.libelle_ar,
          id_sp: resUsers[index].id_role,
          nom_sp: resUsers[index].specialites.nom+"@@"+resUsers[index].specialites.nom_en+"@@"+resUsers[index].specialites.nom_ar,
          autre_sp: resUsers[index].autre_sp
        });
      }
    },
    [dispatch]
  );

  async function clearUsers(resUsers) {
    let tx = db.transaction("personels", "readwrite");
    await tx.objectStore("personels").clear();
    storeUsers(resUsers);
  }

  const getUser = useCallback(async () => {
    var response = await dispatch(getPersonnel());
    var resUsers = await response.payload.findValider;
    var findNonValider = await response.payload.findNonValider;
    setEntities(resUsers);
    setEntitiesNo(findNonValider);
    let merged_arr = resUsers.concat(findNonValider)
    clearUsers(merged_arr);
  }, [dispatch]);

  async function initUser() {
    const tx = db.transaction("personels", "readwrite");
    let store = tx.objectStore("personels");
    let users = await store.getAll();
    var array = [];
    var arrayV = [];
    users.forEach((val) => {
      if (val.id_role === 2) {
        val.valider === 1 ? array.push(val) : arrayV.push(val);
      }
    });
    setEntities(array);
    setEntitiesNo(arrayV);
    /* setEntities(users); */
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
        localization={
          lang === "fr"
            ? MRT_Localization_FR
            : lang === "ar"
            ? MRT_Localization_AR
            : MRT_Localization_EN
        }
      />
    );
  }
  return (
    <>
      {alert}
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
              {t("User.add")}
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">{t("User.listP")}</h4>
            <Card className="card-header">
              <Card.Body>
                <ListTable list={entitiesNo}></ListTable>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <h4 className="title">{t("User.listV")}</h4>
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

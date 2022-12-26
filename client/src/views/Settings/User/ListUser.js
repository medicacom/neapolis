import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchUsers, userChangeEtat } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
// core components
function ListUser({ onlineStatus }) {
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
  const [entities, setEntities] = React.useState([]);
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
      accessorKey: "roles.nom",
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
    {
      header: t("actions"),
      accessorKey: "id",
      Cell: ({ cell, row }) =>
        onlineStatus === 1 ? (
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
      var obj = { ...cursor.value };
      switch (etat) {
        case 0:
          obj.etat = 1;
          notify(1, t("enable"));
          break;
        case 1:
          obj.etat = 0;
          notify(1, t("disable"));
          break;
        default:
          break;
      }

      obj.updated = 1;
      cursor.update(obj);
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
            notify(1, t("enable"));
            break;
          case 1:
            notify(1, t("disable"));
            break;
          default:
            break;
        }
      });
    } else {
      updateUser(id, e);
    }
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
          nom_gouvernorat:
            resUsers[index].gouvernorats.libelle +
            "@@" +
            resUsers[index].gouvernorats.libelle_en +
            "@@" +
            resUsers[index].gouvernorats.libelle_ar,
          id_sp: resUsers[index].id_role,
          nom_sp:
            resUsers[index].specialites.nom +
            "@@" +
            resUsers[index].specialites.nom_en +
            "@@" +
            resUsers[index].specialites.nom_ar,
          autre_sp: resUsers[index].autre_sp,
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
    var response = await dispatch(fetchUsers());
    var resUsers = response.payload;
    setEntities(resUsers);
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
            <h4 className="title">{t("User.listU")}</h4>
            <Card className="card-header">
              <Card.Body>
                <ListTable list={entities}></ListTable>
                {/* <MaterialReactTable
                  columns={columns}
                  data={entities}
                  enableColumnActions={true}
                  enableColumnFilters={true}
                  enablePagination={true}
                  enableSorting={true}
                  enableBottomToolbar={true}
                  enableTopToolbar={true}
                  muiTableBodyRowProps={{ hover: false }}
                />  */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListUser;

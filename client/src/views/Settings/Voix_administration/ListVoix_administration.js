import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  fetchVoix_administration,
  voix_administrationChangeEtat,
  voix_administrationDeleted,
} from "../../../Redux/voix_administrationReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useHistory } from "react-router";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_AR } from '../../utils/ar_table';
// core components
function ListVoix_administration({ onlineStatus }) {
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  let db;
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        accessorKey: "id",
        header: "actions",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push(
                  "/voix_administration/update/" + cell.row.original.id
                );
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
            {/*  <Button
              id={"idLigne_" + cell.row.original.id}
              onClick={(e) => {
                confirmMessage(cell.row.original.id,e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" id={"idLigne_" + cell.row.original.id}/>
            </Button> */}
          </div>
        ),
      },
      //end
    ],
    []
  );
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
  const confirmMessage = (id, e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette voix_administration?"
        onConfirm={() => deleteVoix_administration(id, e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {/* Vous éte sure de supprime cette User? */}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push("ajouterVoix_administration");
  }
  function deleteVoix_administration(id, e) {
    dispatch(voix_administrationDeleted({ id })).then((val) => {
      notify(1, "Voix_administration supprimer avec succes");
      getVoix_administration();
      hideAlert();
    });
  }

  //storeVoix_administration
  const storeVoix_administration = useCallback(
    async (resVoix_administration) => {
      const tx = db.transaction("voix_administrations", "readwrite");
      for (let index = 0; index < resVoix_administration.length; index++) {
        await tx.objectStore("voix_administrations").add({
          description: resVoix_administration[index].description,
          etat: resVoix_administration[index].etat,
          id: resVoix_administration[index].id,
          saved: 1,
          updated: 0,
          deleted: 0,
          type_table: 5,
        });
      }
    },
    []
  );

  async function clearVoix_administration(resVoix_administration) {
    let txVoix_administration = db.transaction(
      "voix_administrations",
      "readwrite"
    );
    await txVoix_administration.objectStore("voix_administrations").clear();
    if (resVoix_administration.length != 0)
      storeVoix_administration(resVoix_administration);
  }

  const getVoix_administration = useCallback(async () => {
    var voix_administration = await dispatch(fetchVoix_administration());
    var resVoix_administration = await voix_administration.payload;
    setEntities(resVoix_administration);
    clearVoix_administration(resVoix_administration);
  }, [dispatch]);

  async function initVoix_administration() {
    const tx = db.transaction("voix_administrations", "readwrite");
    let voix_administrationStore = tx.objectStore("voix_administrations");
    let voix_administration = await voix_administrationStore.getAll();
    setEntities(voix_administration);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getVoix_administration();
    else {
      initVoix_administration();
    }
  }

  useEffect(() => {
    init();
  }, []); //now shut up eslint

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

  async function updateVoix_administration(id, etat) {
    const tx = db.transaction("voix_administration", "readwrite");
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
    initVoix_administration();
  }
  function changeEtat(id, e) {
    /* setEntities([]); */
    if (onlineStatus === 1) {
      dispatch(voix_administrationChangeEtat(id)).then((e1) => {
        getVoix_administration();
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
      updateVoix_administration(id, e);
    }
  }

  return (
    <>
      {alert}
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="12">
            <Button
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              {t("voice.add_voice")}
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">{t("voice.list")}</h4>
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

export default ListVoix_administration;

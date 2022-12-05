import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  fetchEffet_indesirable,
  effet_indesirableChangeEtat,
  effet_indesirableDeleted,
} from "../../../Redux/effet_indesirableReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useHistory } from "react-router";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
// core components
function ListEffet_indesirable({ onlineStatus }) {
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
                  "/effet_indesirable/update/" + cell.row.original.id
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
        title="Vous éte sure de supprime cette effet_indesirable?"
        onConfirm={() => deleteEffet_indesirable(id, e)}
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
    navigate.push("ajouterEffet_indesirable");
  }
  function deleteEffet_indesirable(id, e) {
    dispatch(effet_indesirableDeleted({ id })).then((val) => {
      notify(1, "Effet_indesirable supprimer avec succes");
      getEffet_indesirable();
      hideAlert();
    });
  }

  //storeEffet_indesirable
  const storeEffet_indesirable = useCallback(async (resEffet_indesirable) => {
    const tx = db.transaction("effet_indesirables", "readwrite");
    for (let index = 0; index < resEffet_indesirable.length; index++) {
      await tx.objectStore("effet_indesirables").add({
        description: resEffet_indesirable[index].description,
        etat: resEffet_indesirable[index].etat,
        id: resEffet_indesirable[index].id,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 6,
      });
    }
  }, []);

  async function clearEffet_indesirable(resEffet_indesirable) {
    let txEffet_indesirable = db.transaction("effet_indesirables", "readwrite");
    await txEffet_indesirable.objectStore("effet_indesirables").clear();
    if (resEffet_indesirable.length != 0)
      storeEffet_indesirable(resEffet_indesirable);
  }

  const getEffet_indesirable = useCallback(async () => {
    var effet_indesirable = await dispatch(fetchEffet_indesirable());
    var resEffet_indesirable = await effet_indesirable.payload;
    setEntities(resEffet_indesirable);
    clearEffet_indesirable(resEffet_indesirable);
  }, [dispatch]);

  async function initEffet_indesirable() {
    const tx = db.transaction("effet_indesirables", "readwrite");
    let effet_indesirableStore = tx.objectStore("effet_indesirables");
    let effet_indesirable = await effet_indesirableStore.getAll();
    setEntities(effet_indesirable);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getEffet_indesirable();
    else {
      initEffet_indesirable();
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

  async function updateEffet_indesirable(id, etat) {
    const tx = db.transaction("effet_indesirable", "readwrite");
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
    initEffet_indesirable();
  }
  function changeEtat(id, e) {
    /* setEntities([]); */
    if (onlineStatus === 1) {
      dispatch(effet_indesirableChangeEtat(id)).then((e1) => {
        getEffet_indesirable();
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
      updateEffet_indesirable(id, e);
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
              {t("effect.add_effect")}
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">{t("effect.list")}</h4>
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

export default ListEffet_indesirable;

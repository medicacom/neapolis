import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  fetchSpecialite,
  specialiteChangerEtat,
} from "../../../Redux/specialiteReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
import { openDB } from "idb";

// core components
function ListSpecialite({ onlineStatus }) {
  let db;
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  document.title = "Liste des specialites";
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [entities, setEntities] = React.useState([]);
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
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: t("name"),
        accessorKey: "nom",
        Cell: ({ cell }) =>
          lang === "fr"
            ? cell.row.original.nom
            : lang === "en"
            ? cell.row.original.nom_en
            : cell.row.original.nom_ar,
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
                  navigate.push("/specialite/update/" + cell.row.original.id);
                }}
                variant="warning"
                size="sm"
                className="text-warning btn-link edit"
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                id={"idLigne_" + cell.row.original.id}
                onClick={(e) => {
                  changeEtat(cell.row.original.id, cell.row.original.etat);
                }}
                variant="danger"
                size="sm"
                className={
                  cell.row.original.etat === 1
                    ? "text-success btn-link"
                    : "text-danger btn-link"
                }
              >
                <i
                  className={
                    cell.row.original.etat === 1 ? "fa fa-check" : "fa fa-times"
                  }
                  id={"idLigne_" + cell.row.original.id}
                />
              </Button>
            </div>
          ) : (
            ""
          ),
      },
      //end
    ],
    []
  );
  function ajouter() {
    navigate.push("/ajouterSpecialite");
  }
  function changeEtat(id, e) {
    dispatch(specialiteChangerEtat(id)).then((e1) => {
      getSpecialite();
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

  //storeMedicament
  const storeSp = useCallback(async (res) => {
    const tx = db.transaction("specialites", "readwrite");
    for (let index = 0; index < res.length; index++) {
      await tx.objectStore("specialites").add({
        nom: res[index].nom,
        nom_en: res[index].nom_en,
        nom_ar: res[index].nom_ar,
        etat: res[index].etat,
        id: res[index].id,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 9,
      });
    }
  }, []);

  async function clearSp(res) {
    let txMedicament = db.transaction("specialites", "readwrite");
    await txMedicament.objectStore("specialites").clear();
    if (res.length != 0) storeSp(res);
  }

  const getSpecialite = useCallback(async () => {
    var specialite = await dispatch(fetchSpecialite());
    var res = await specialite.payload;
    setEntities(res);
    clearSp(res);
  }, [dispatch]);

  async function initSp() {
    const tx = db.transaction("specialites", "readwrite");
    let spStore = tx.objectStore("specialites");
    let sp = await spStore.getAll();
    setEntities(sp);
  }

  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getSpecialite();
    else {
      initSp();
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

  return (
    <>
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="12">
            {onlineStatus === 1 ? (
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
                {t("speciality.add")}
              </Button>
            ) : (
              ""
            )}
          </Col>
          <Col md="12">
            <h4 className="title">{t("speciality.list")}</h4>
            <Card>
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

export default ListSpecialite;

import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchAge, ageChangeEtat } from "../../../Redux/ageReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
import { openDB } from "idb";

// core components
function ListAge({ onlineStatus }) {
  let db;
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
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
        header: t("description"),
        accessorKey: "description",
        Cell: ({ cell }) =>
          lang === "fr"
            ? cell.row.original.description
            : lang === "en"
            ? cell.row.original.description_en
            : cell.row.original.description_ar,
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
                  navigate("/age/update/" + cell.row.original.id);
                }}
                variant="warning"
                size="sm"
                className="text-warning btn-link edit"
              >
                <i className="fa fa-edit" />
              </Button>
              <Button
                onClick={() => {
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
    navigate.push("/ajouterAge");
  }

  //storeMedicament
  const storeAge = useCallback(async (res) => {
    const tx = db.transaction("ages", "readwrite");
    for (let index = 0; index < res.length; index++) {
      await tx.objectStore("ages").add({
        description: res[index].description,
        description_en: res[index].description_en,
        description_ar: res[index].description_ar,
        etat: res[index].etat,
        id: res[index].id,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 9,
      });
    }
  }, []);

  async function clearAge(res) {
    let txMedicament = db.transaction("ages", "readwrite");
    await txMedicament.objectStore("ages").clear();
    if (res.length != 0) storeAge(res);
  }

  const getAge = useCallback(async () => {
    var age = await dispatch(fetchAge());
    var res = await age.payload;
    setEntities(res);
    if (res.length !== 0) {
      clearAge(res);
    }
  }, [dispatch]);

  async function initAge() {
    const tx = db.transaction("ages", "readwrite");
    let ageStore = tx.objectStore("ages");
    let ages = await ageStore.getAll();
    setEntities(ages);
  }

  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getAge();
    else {
      initAge();
    }
  }

  useEffect(() => {
    init();
  }, [getAge]); //now shut up eslint

  function changeEtat(id, e) {
    /* setEntities([]); */
    dispatch(ageChangeEtat(id)).then((e1) => {
      getAge();
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
      <ToastContainer />
      <Container fluid>
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
                {t("age.add")}
              </Button>
            ) : (
              ""
            )}
          </Col>
          <Col md="12">
            <h4 className="title">{t("age.list")}</h4>
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

export default ListAge;

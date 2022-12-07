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
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_AR } from '../../utils/ar_table';

// core components
function ListSpecialite() {
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
        Cell: ({ cell, row }) => (
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

  const getSpecialite = useCallback(
    async (titre) => {
      var specialite = await dispatch(fetchSpecialite());
      setEntities(specialite.payload);
    },
    [dispatch]
  );

  useEffect(() => {
    getSpecialite();
  }, [getSpecialite]); //now shut up eslint

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
              {t("speciality.add")}
            </Button>
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

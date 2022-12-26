import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchPays } from "../../../Redux/paysReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MaterialReactTable from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";

// core components
function ListPays({ onlineStatus }) {
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: t("name"),
        accessorKey: "nom",
      },
      {
        header: t("actions"),
        accessorKey: "id",
        Cell: ({ cell, row }) =>
          onlineStatus === 1 ? (
            <div className="actions-right block_action">
              <Button
                onClick={() => {
                  navigate.push("/pays/update/" + cell.row.original.id);
                }}
                variant="warning"
                size="sm"
                className="text-warning btn-link edit"
              >
                <i className="fa fa-edit" />
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
    navigate.push('/ajouterPays');
  }

  const getPays = useCallback(async () => {
    var pays = await dispatch(fetchPays());
    setEntities(pays.payload);
  }, [dispatch]);

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
  useEffect(() => {
    getPays()
  }, [getPays]) //now shut up eslint
  return (
    <>
      <Container fluid>
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
              {t("pays.add")}
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">{t("pays.list")}</h4>
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

export default ListPays;

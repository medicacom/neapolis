import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  getDeclarations,
  getDeclarationsById,
} from "../../Redux/declarationReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useMemo } from "react";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../utils/ar_table";

// core components
function ListDeclaration({obj}) {
  var id_role = obj.user.id_role;
  var id = obj.user.id;
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: t("Declaration.user"),
        accessorKey: "users.nom",
        Cell: ({ cell, row }) => (
          <div>
            {cell.row.original.users
              ? cell.row.original.users.nom +
                " " +
                cell.row.original.users.prenom
              : cell.row.original.patients.passagers.nom +
                " " +
                cell.row.original.patients.passagers.prenom}
            {/* {cell.row.original.users.nom} {cell.row.original.users.prenom} */}
          </div>
        ),
      },
      {
        header: t("Declaration.patients"),
        accessorKey: "patients.sexe",
        Cell: ({ cell, row }) => (
          <div>
            {cell.row.original.patients.sexe === 1
              ? "Homme"
              : cell.row.original.patients.sexe === 2
              ? "Femme"
              : "Autre"}
          </div>
        ),
      },
      {
        header: t("Declaration.drugs"),
        accessorKey: "medicaments.nom",
      },
      {
        header: t("Declaration.date"),
        accessorKey: "createdAt",
        Cell: ({ cell, row }) => (
          <div>
            {/* {new Date(cell.row.original.patients.createdAt).format('DD/MM/YYYY')} */}
            {new Date(
              new Date(cell.row.original.patients.createdAt).getTime() -
                new Date(
                  cell.row.original.patients.createdAt
                ).getTimezoneOffset() *
                  60000
            )
              .toISOString()
              .slice(0, 10)}
          </div>
        ),
      },
      {
        header: t("Declaration.detail"),
        accessorKey: "id",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                confirmMessage(cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-eye" />
            </Button>
          </div>
        ),
      },
      //end
    ],
    []
  );
  function ajouter() {
    navigate.push("/declaration");
  }

  const getDeclaration = useCallback(
    async () => {
      var dec = await dispatch(getDeclarations({id_role,id}));
      setEntities(dec.payload);
    },
    [dispatch]
  );
  const confirmMessage = async (id, e) => {
    var dec = await dispatch(getDeclarationsById(id));
    var data = await dec.payload;
    setAlert(
      <SweetAlert
        customClass="pop-up-extra"
        style={{ display: "block", marginTop: "-100px" }}
        title={"Détail déclaration"}
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
      >
        <Row>
          <Col md="4">
            <h3>{t("Declaration.patient")}</h3>
            <ul>
              <li>
                <strong>Nom personnel: </strong>
                {data.users
                  ? data.users.nom + " " + data.users.prenom
                  : data.patients.passagers.nom +
                    " " +
                    data.patients.passagers.prenom}
                {/* {data.users.nom + " " + data.users.prenom} */}
              </li>
              {/* <li>
                <strong>Adresse email: </strong>
                {data.users.email}
              </li>
              <li>
                <strong>Numéro téléphone: </strong>
                {data.users.tel}
              </li>
              <li>
                <strong>Specialite: </strong>
                {data.users.specialites.nom}
              </li> */}
              <li>
                <strong>{t("Declaration.date")}: </strong>
                {new Date(
                  new Date(data.patients.createdAt).getTime() -
                    new Date(data.patients.createdAt).getTimezoneOffset() *
                      60000
                )
                  .toISOString()
                  .slice(0, 10)}
              </li>
              <li>
                <strong>{t("Declaration.list")}: </strong>
                {data.patients.initiales}
              </li>
              <li>
                <strong>{t("Declaration.gendre")}: </strong>
                {data.patients.sexe === 1
                  ? t("Declaration.man")
                  : data.patients.sexe === 2
                  ? t("Declaration.woman")
                  : t("Declaration.other")}
              </li>
              <li>
                <strong>{t("Declaration.age")}: </strong>
                {data.patients.age === 1
                  ? data.patients.dateNaissance
                  : data.patients.age === 2
                  ? data.patients.agePatient
                  : data.patients.ages.description}
              </li>
              <li>
                <strong>{t("Declaration.indication")}: </strong>
                {data.patients.indications.description}
              </li>
            </ul>
          </Col>
          <Col md="4">
            <h3>{t("Declaration.drugs")}</h3>
            <ul>
              <li>
                <strong>{t("Declaration.name_drug")}: </strong>
                {data.medicaments.nom}
              </li>
              <li>
                <strong>{t("Declaration.numero")}: </strong>
                {data.numero}
              </li>
              <li>
                <strong>{t("Declaration.dosage")}: </strong>
                {data.posologie}
              </li>
              <li>
                <strong>{t("Declaration.voice")}: </strong>
                {data.voix_administrations.description}
              </li>
              <li>
                <strong>{t("Declaration.start")}: </strong>
                {data.dateDebutAdmin}
              </li>
              <li>
                <strong>{t("Declaration.end")}: </strong>
                {data.dateFinAdmin}
              </li>
            </ul>
          </Col>
          <Col md="4">
            <h3>{t("Declaration.effects")}</h3>
            <ul>
              <li>
                <strong>{t("Declaration.effects")}: </strong>
                {data.effet_indesirables.description}
              </li>
              <li>
                <strong>{t("Declaration.start")}: </strong>
                {data.dateDebut}
              </li>
              <li>
                <strong>{t("Declaration.end")}: </strong>
                {data.dateFin}
              </li>
              <li>
                <strong>{t("Declaration.information")}: </strong>
                {data.information}
              </li>
              <li>
                <strong>{t("Declaration.complementary")}: </strong>
                {data.complementaires}
              </li>
            </ul>
          </Col>
        </Row>
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    getDeclaration();
  }, [getDeclaration]); //now shut up eslint

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
      <ToastContainer />
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
              {t("Declaration.add")}
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">{t("Declaration.list")}</h4>
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

export default ListDeclaration;

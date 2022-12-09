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
import { openDB } from "idb";

// core components
function ListDeclaration({ obj, onlineStatus }) {
  let db;
  var id_role = onlineStatus === 1 ? obj.user.id_role : obj.id_role;
  var id = onlineStatus === 1 ? obj.user.id : obj.id;
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
        header: t("Declaration.data"),
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
        header: t("User.specialite"),
        accessorKey: "users.specialites",
        Cell: ({ cell, row }) => (
          <div>
            {cell.row.original.users
              ? cell.row.original.users.specialites.nom
              : cell.row.original.patients.passagers.specialites.nom}
            {/* {cell.row.original.users.specialites.nom} */}
          </div>
        ),
      },
      {
        header: t("Declaration.drugs"),
        accessorKey: "medicaments.nom",
        Cell: ({ cell, row }) => (
          <div>
            {lang === "fr"
              ? cell.row.original.medicaments.nom
              : lang === "en"
              ? cell.row.original.medicaments.nom_en
              : cell.row.original.medicaments.nom_ar}
          </div>
        ),
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

  //storeDeclaration
  /*  const storeRapports = useCallback(
    async (res) => {
      const tx1 = db.transaction("rapports", "readwrite");
      await tx1.objectStore("rapports").add({
        id: res.id,
        hospitalisation: res.hospitalisation,
      });
    },
    [dispatch]
  ); */

  //storeDeclaration
  const storeDeclaration = useCallback(
    async (res) => {
      const tx = db.transaction("declarations", "readwrite");
      for (let index = 0; index < res.length; index++) {
        var nomAge = "";
        if (res[index].patients.ages) {
          nomAge =
            lang === "fr"
              ? res[index].patients.ages.description
              : lang === "en"
              ? res[index].patients.ages.description_en
              : res[index].patients.ages.description_ar;
        }
        var nomMed =
          lang === "fr"
            ? res[index].medicaments.nom
            : lang === "en"
            ? res[index].medicaments.nom_en
            : res[index].medicaments.nom_ar;
        var nomInd =
          lang === "fr"
            ? res[index].patients.indications.description
            : lang === "en"
            ? res[index].patients.indications.description_en
            : res[index].patients.indications.description_ar;
        var nomVoix =
          lang === "fr"
            ? res[index].voix_administrations.description
            : lang === "en"
            ? res[index].voix_administrations.description_en
            : res[index].voix_administrations.description_ar;
        var nomEff =
          lang === "fr"
            ? res[index].voix_administrations.description
            : lang === "en"
            ? res[index].effet_indesirables.description_en
            : res[index].effet_indesirables.description_ar;
        await tx.objectStore("declarations").add({
          id_patient: res[index].patients.id,
          initiales: res[index].patients.initiales,
          age: res[index].patients.age,
          sexe: res[index].patients.sexe,
          dateNaissance: res[index].patients.dateNaissance,
          agePatient: res[index].patients.agePatient,
          ageCategorie: res[index].patients.ageCategorie,
          id_indication: res[index].patients.id_indication,
          id_passager: res[index].patients.id_passager,
          poid: res[index].patients.poid,
          taille: res[index].patients.taille,
          allergie: res[index].patients.allergie,
          dateDebut: res[index].dateDebut,
          dateFin: res[index].dateFin,
          information: res[index].information,
          complementaires: res[index].complementaires,
          posologie: res[index].posologie,
          numero: res[index].numero,
          dateDebutAdmin: res[index].dateDebutAdmin,
          dateFinAdmin: res[index].dateFinAdmin,
          id_medicament: res[index].id_medicament,
          id: res[index].id,
          id_user: res[index].id_user,
          nom_user: res[index].nom + " " + res[index].prenom,
          id_eff: res[index].id_eff,
          id_voix: res[index].id_voix,
          id_patient: res[index].id_patient,
          id_passager: res[index].id_passager,
          description_eff: res[index].description_eff,
          grave: res[index].grave,
          hospitalisation: res[index].hospitalisation,
          pronostic: res[index].pronostic,
          incapacite: res[index].incapacite,
          deces: res[index].deces,
          anomalie: res[index].anomalie,
          autre: res[index].autre,
          traites: res[index].traites,
          evolution: res[index].evolution,
          survenus: res[index].survenus,
          date_admin: res[index].date_admin,
          therapeutique: res[index].therapeutique,
          nomMed: nomMed,
          nomInd: nomInd,
          nomVoix: nomVoix,
          nomEff: nomEff,
          nomAge: nomAge,
        });
        /* storeRapports(res[index]); */
      }
    },
    [dispatch]
  );

  async function clearDeclaration(resUsers) {
    let tx1 = db.transaction("declarations", "readwrite");
    await tx1.objectStore("declarations").clear();
    storeDeclaration(resUsers);
  }

  const getDeclaration = useCallback(async () => {
    var response = await dispatch(getDeclarations({ id_role, id }));
    var dec = response.payload;
    setEntities(dec);
    clearDeclaration(dec);
  }, [dispatch]);

  const confirmMessage = async (id, e) => {
    var dec = await dispatch(getDeclarationsById(id));
    var data = await dec.payload;
    var nomAge = "";
    if (data.patients.ages) {
      nomAge =
        lang === "fr"
          ? data.patients.ages.description
          : lang === "en"
          ? data.patients.ages.description_en
          : data.patients.ages.description_ar;
    }
    var nomMed =
      lang === "fr"
        ? data.medicaments.nom
        : lang === "en"
        ? data.medicaments.nom_en
        : data.medicaments.nom_ar;
    var nomInd =
      lang === "fr"
        ? data.patients.indications.description
        : lang === "en"
        ? data.patients.indications.description_en
        : data.patients.indications.description_ar;
    var nomVoix =
      lang === "fr"
        ? data.voix_administrations.description
        : lang === "en"
        ? data.voix_administrations.description_en
        : data.voix_administrations.description_ar;
    var nomEff =
      lang === "fr"
        ? data.voix_administrations.description
        : lang === "en"
        ? data.effet_indesirables.description_en
        : data.effet_indesirables.description_ar;
    setAlert(
      <SweetAlert
        customClass="pop-up-extra"
        style={{ display: "block", marginTop: "-100px" }}
        title={t("Declaration.details_dec")}
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={t("Declaration.fermer")}
        cancelBtnText="Non"
      >
        <Row>
          <Col md="4">
            <h3>{t("Declaration.patient")}</h3>
            <ul>
              <li>
                <strong>{t("Declaration.personal")}: </strong>
                {data.users
                  ? data.users.nom + " " + data.users.prenom
                  : data.patients.passagers.nom +
                    " " +
                    data.patients.passagers.prenom}
              </li>
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
                  : nomAge}
              </li>
              <li>
                <strong>{t("Declaration.indication")}: </strong>
                {nomInd}
              </li>
              <li>
                <strong>{t("Declaration.poid")}: </strong>
                {data.patients.poid}
              </li>
              <li>
                <strong>{t("Declaration.taille")}: </strong>
                {data.patients.taille}
              </li>
              <li>
                <strong>{t("Declaration.allergie")}: </strong>
                {data.patients.allergie}
              </li>
            </ul>
          </Col>
          <Col md="4">
            <h3>{t("Declaration.drugs")}</h3>
            <ul>
              <li>
                <strong>{t("Declaration.name_drug")}: </strong>
                {nomMed}
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
                {nomVoix}
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
                {nomEff}
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
              <li>
                <strong>{t("Declaration.gravite")}: </strong>
                <br></br>
                {t("Declaration.grave") + ": "}
                {data.grave === 1 ? "Yes" : "Non"}
                <br></br>
                {t("Declaration.hospitalisation") + ": "}
                {data.hospitalisation === 1 ? "Yes" : "No"}
                <br></br>
                {t("Declaration.pronostic") + ": "}
                {data.pronostic === 1 ? "Yes" : "Non"}
                <br></br>
                {t("Declaration.deces") + ": "}
                {data.deces === 1 ? "Yes" : "Non"}
                <br></br>
                {t("Declaration.incapacite") + ": "}
                {data.incapacite === 1 ? "Yes" : "Non"}
                <br></br>
                {t("Declaration.anomalie" + ": ")}
                {data.anomalie === 1 ? ":Yes" : "Non"}
                <br></br>
                {t("Declaration.autre") + ": "}
                {data.autre === 1 ? "Yes" : "Non"}
              </li>
              <li>
                <strong>{t("Declaration.traites")}: </strong>
                {data.traites === 1
                  ? t("Declaration.traites_yes")
                  : data.traites === 2
                  ? t("Declaration.traites_no")
                  : t("Declaration.traites_inc")}
              </li>
              <li>
                <strong>{t("Declaration.evolution")}: </strong>
                <br></br>
                {data.evolution === 1
                  ? t("Declaration.evolution_txt1")
                  : data.evolution === 2
                  ? t("Declaration.evolution_txt2")
                  : data.evolution === 3
                  ? t("Declaration.evolution_txt3")
                  : data.evolution === 4
                  ? t("Declaration.evolution_txt4")
                  : data.evolution === 5
                  ? t("Declaration.evolution_txt5")
                  : data.evolution === 6
                  ? t("Declaration.evolution_txt6")
                  : ""}
              </li>
              <li>
                <strong>{t("Declaration.survenus")}: </strong>
                <br></br>
                {data.survenus === 1
                  ? t("Declaration.survenus_txt1")
                  : data.survenus === 2
                  ? t("Declaration.survenus_txt2")
                  : data.survenus === 3
                  ? t("Declaration.survenus_txt3")
                  : data.survenus === 4
                  ? t("Declaration.survenus_txt4")
                  : data.survenus === 5
                  ? t("Declaration.survenus_txt5")
                  : data.survenus === 6
                  ? t("Declaration.survenus_txt6")
                  : ""}
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

  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getDeclaration();
    else {
      /* initDeclaration(); */
    }
  }
  useEffect(() => {
    /* getDeclaration(); */
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

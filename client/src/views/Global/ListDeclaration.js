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
import ExcelJs from "exceljs";

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
  const [entitiesExcel, setEntitiesExcel] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: t("Declaration.data"),
        accessorKey: "nomNot",
      },
      {
        header: t("User.specialite"),
        accessorKey: "specialite",
      },
      {
        header: t("Declaration.drugs"),
        accessorKey: "medicaments",
      },
      {
        header: t("Declaration.date"),
        accessorKey: "createdAt",
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
  function getMedName(ligne) {
    var spliteName = ligne.split("@@");
    var i = lang === "fr" ? 0 : lang === "fr" ? 1 : 2;
    return spliteName[i];
  }
  //storeDeclaration
  const storeDeclaration = useCallback(
    async (res) => {
      const tx = db.transaction("declarations", "readwrite");
      for (let index = 0; index < res.length; index++) {
        var nomAge = "";
        if (res[index].patients.ages) {
          nomAge =
            res[index].patients.ages.description +
            "@@" +
            res[index].patients.ages.description_en +
            "@@" +
            res[index].patients.ages.description_ar;
        }
        var nomMed =
          res[index].medicaments.nom +
          "@@" +
          res[index].medicaments.nom_en +
          "@@" +
          res[index].medicaments.nom_ar;

        var nomInd =
          res[index].patients.indications.description +
          "@@" +
          res[index].patients.indications.description_en +
          "@@" +
          res[index].patients.indications.description_ar;

        var nomVoix =
          res[index].voix_administrations.description +
          "@@" +
          res[index].voix_administrations.description_en +
          "@@" +
          res[index].voix_administrations.description_ar;

        /* var nomEff =
          res[index].effet_indesirables.description +
          "@@" +
          res[index].effet_indesirables.description_en +
          "@@" +
          res[index].effet_indesirables.description_ar; */
        var nomEff = res[index].effet;

        await tx.objectStore("declarations").add({
          patients: res[index].patients,
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
          createdAt: res[index].patients.createdAt,
          createdAt: res[index].patients.updatedAt,
          id_passager: res[index].patients.id_passager,
          medicaments: res[index].medicaments,
          effet_indesirables: res[index].effet_indesirables,
          voix_administrations: res[index].voix_administrations,
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
    var array = [];
    dec.forEach((element) => {
      var nom = "";
      nom = element.users
        ? element.users.nom + " " + element.users.prenom
        : element.passagers.nom + " " + element.passagers.prenom;
      var sp = "";
      sp = element.users
        ? element.users.specialites.nom
        : element.passagers.specialites.nom;
      var med =
        lang === "fr"
          ? element.medicaments.nom
          : lang === "en"
          ? element.medicaments.nom_en
          : element.medicaments.nom_ar;
      var date = new Date(
        new Date(element.patients.createdAt).getTime() -
          new Date(element.patients.createdAt).getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
      var id = element.id;
      array.push({
        id: id,
        nomNot: nom,
        medicaments: med,
        specialite: sp,
        createdAt: date,
      });
    });
    setEntities(array);
    setEntitiesExcel(dec);
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

    var nomEff = data.effet;
    /*  var nomEff =
      lang === "fr"
        ? data.voix_administrations.description
        : lang === "en"
        ? data.effet_indesirables.description_en
        : data.effet_indesirables.description_ar;
    */
    setAlert(
      <SweetAlert
        customClass="pop-up-extra"
        style={{ display: "block", marginTop: "100px" }}
        title={t("Declaration.details_dec")}
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={t("Declaration.fermer")}
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
                <strong>{t("Declaration.initials")}: </strong>
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
                <strong>{t("Declaration.allergie_pop")}: </strong>
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
                {data.grave === 1 ? t("Declaration.yes") : t("Declaration.no")}
                <br></br>
                {t("Declaration.hospitalisation") + ": "}
                {data.hospitalisation === 1
                  ? t("Declaration.yes")
                  : t("Declaration.no")}
                <br></br>
                {t("Declaration.pronostic") + ": "}
                {data.pronostic === 1
                  ? t("Declaration.yes")
                  : t("Declaration.no")}
                <br></br>
                {t("Declaration.deces") + ": "}
                {data.deces === 1 ? t("Declaration.yes") : t("Declaration.no")}
                <br></br>
                {t("Declaration.incapacite") + ": "}
                {data.incapacite === 1
                  ? t("Declaration.yes")
                  : t("Declaration.no")}
                <br></br>
                {t("Declaration.anomalie") + ": "}
                {data.anomalie === 1
                  ? t("Declaration.yes")
                  : t("Declaration.no")}
                <br></br>
                {t("Declaration.autre") + ": "}
                {data.autre === 1 ? t("Declaration.yes") : t("Declaration.no")}
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

  async function initDeclaration() {
    const tx = db.transaction("declarations", "readwrite");
    let store = tx.objectStore("declarations");
    let dec = await store.getAll();
    setEntities(dec);
  }

  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getDeclaration();
    else {
      initDeclaration();
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
  //exportEcel
  const exportToExcel = useCallback(async (data) => {
    /* var first = Object.keys(res)[0] */

    let sheetName = `Déclaration.xlsx`;
    let headerName = "RequestsList";

    // showGridLines: false
    let workbook = new ExcelJs.Workbook();
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });
    // let sheet2 = workbook.addWorksheet("Second sheet", { views: [{ showGridLines: false }] });

    // header
    let columnArr = [
      { name: t("Declaration.personal") },
      { name: t("Declaration.date") },
      { name: t("Declaration.initials") },
      { name: t("Declaration.gendre") },
      { name: t("Declaration.age") },
      { name: t("Declaration.indication") },
      { name: t("Declaration.poid") },
      { name: t("Declaration.taille") },
      { name: t("Declaration.allergie_pop") },
      { name: t("Declaration.name_drug") },
      { name: t("Declaration.numero") },
      { name: t("Declaration.dosage") },
      { name: t("Declaration.voice") },
      { name: t("Declaration.start") },
      { name: t("Declaration.end") },
      { name: t("Declaration.effects") },
      { name: t("Declaration.start") },
      { name: t("Declaration.end") },
      { name: t("Declaration.information") },
      { name: t("Declaration.grave") },
      { name: t("Declaration.complementary") },
      { name: t("Declaration.hospitalisation") },
      { name: t("Declaration.pronostic") },
      { name: t("Declaration.deces") },
      { name: t("Declaration.incapacite") },
      { name: t("Declaration.anomalie") },
      { name: t("Declaration.autre") },
      { name: t("Declaration.traites") },
      { name: t("Declaration.evolution") },
      { name: t("Declaration.survenus") },
    ];
    /* for (let i in res[first][0]) {
      if(i !=="sujet" && i !== "titre"){
        let tempObj = { name: "" };
        tempObj.name = i;
        columnArr.push(tempObj);
      }
    } */
    sheet.addTable({
      name: `Header`,
      ref: "F1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "",
        showRowStripes: false,
        showFirstColumn: true,
        width: 200,
      },
      columns: [{ name: "Déclaration : " }],
      rows: [[``]],
    });
    sheet.addTable({
      name: `Header`,
      ref: "A1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "",
        showRowStripes: false,
        showFirstColumn: true,
        width: 200,
      },
      columns: [{ name: "Déclaration" }],
      rows: [[``]],
    });
    console.log(columnArr, data);
    sheet.addTable({
      name: headerName,
      ref: "A3",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: true,
        width: 200,
      },
      columns: columnArr ? columnArr : [{ name: "" }],
      rows: data.map((e, k) => {
        let arr = [];
        for (let i in e) {
          arr.push(e[i]);
        }
        return arr;
      }),
    });

    sheet.getCell("F1").font = { size: 25, bold: true };
    sheet.getCell("A1").font = { size: 25, bold: true };

    /* const table = sheet.getTable(headerName);
    for (let i = 0; i < table.table.columns.length; i++) {
      for (let j = 0; j <= table.table.rows.length; j++) {
        console.log(`${String.fromCharCode(65 + i)}3`)
        sheet.getCell(`${String.fromCharCode(65 + i)}${j + 3}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    } */

    const writeFile = (fileName, content) => {
      const link = document.createElement("a");
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile(sheetName, buffer);
    });
  }, []);
  const getDetail = useCallback(
    async (res) => {
      var array = [];
      console.log(res);
      res.forEach((data) => {
        var nomAge = "";

        //ages patients
        if (data.patients.ages) {
          nomAge =
            lang === "fr"
              ? data.patients.ages.description
              : lang === "en"
              ? data.patients.ages.description_en
              : data.patients.ages.description_ar;
        }

        //medicaments
        var nomMed =
          lang === "fr"
            ? data.medicaments.nom
            : lang === "en"
            ? data.medicaments.nom_en
            : data.medicaments.nom_ar;

        //indications
        var nomInd =
          lang === "fr"
            ? data.patients.indications.description
            : lang === "en"
            ? data.patients.indications.description_en
            : data.patients.indications.description_ar;

        //voix_administrations
        var nomVoix =
          lang === "fr"
            ? data.voix_administrations.description
            : lang === "en"
            ? data.voix_administrations.description_en
            : data.voix_administrations.description_ar;

        //notificateur
        var nomNotificateur = data.users
          ? data.users.nom + " " + data.users.prenom
          : data.passagers.nom + " " + data.passagers.prenom;

        //date
        var date = new Date(
          new Date(data.patients.createdAt).getTime() -
            new Date(data.patients.createdAt).getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);

        var sexe =
          data.patients.sexe === 1
            ? t("Declaration.man")
            : data.patients.sexe === 2
            ? t("Declaration.woman")
            : t("Declaration.other");

        var age =
          data.patients.age === 1
            ? data.patients.dateNaissance
            : data.patients.age === 2
            ? data.patients.agePatient
            : nomAge;

        var effet = data.effet;
        var poid = data.patients.poid;
        var taille = data.patients.taille;
        var allergie = data.patients.allergie;
        var numero = data.patients.numero;
        var posologie = data.posologie;
        var dateDebutAdmin = data.dateDebutAdmin;
        var dateFinAdmin = data.dateFinAdmin;
        var dateDebut = data.dateDebut;
        var dateFin = data.dateFin;
        var information = data.information;
        var complementaires = data.complementaires;
        var initiales = data.patients.initiales;
        var grave =
          data.grave === 1 ? t("Declaration.yes") : t("Declaration.no");
        var hospitalisation =
          data.hospitalisation === 1
            ? t("Declaration.yes")
            : t("Declaration.no");
        var pronostic =
          data.pronostic === 1 ? t("Declaration.yes") : t("Declaration.no");
        var deces =
          data.deces === 1 ? t("Declaration.yes") : t("Declaration.no");
        var incapacite =
          data.incapacite === 1 ? t("Declaration.yes") : t("Declaration.no");
        var anomalie =
          data.anomalie === 1 ? t("Declaration.yes") : t("Declaration.no");
        var autre =
          data.autre === 1 ? t("Declaration.yes") : t("Declaration.no");
        var traites =
          data.traites === 1
            ? t("Declaration.traites_yes")
            : data.traites === 2
            ? t("Declaration.traites_no")
            : t("Declaration.traites_inc");
        var evolution =
          data.evolution === 1
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
            : "";
        var survenus =
          data.survenus === 1
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
            : "";
        var obj = {};
        obj[0] = nomNotificateur;
        obj[1] = date;
        obj[2] = initiales;
        obj[3] = sexe;
        obj[4] = age;
        obj[5] = nomInd;
        obj[6] = poid;
        obj[7] = taille;
        obj[9] = allergie;
        obj[10] = nomMed;
        obj[11] = numero;
        obj[12] = posologie;
        obj[13] = nomVoix;
        obj[14] = dateDebutAdmin;
        obj[15] = dateFinAdmin;
        obj[16] = effet;
        obj[17] = dateDebut;
        obj[18] = dateFin;
        obj[19] = information;
        obj[20] = complementaires;
        obj[21] = grave;
        obj[22] = hospitalisation;
        obj[23] = pronostic;
        obj[24] = deces;
        obj[25] = incapacite;
        obj[26] = anomalie;
        obj[27] = autre;
        obj[28] = traites;
        obj[29] = evolution;
        obj[30] = survenus;
        array.push(obj);
        /* var obj = {
          nomMed: nomMed,
          nomInd: nomInd,
          nomVoix: nomVoix,
          date: date,
          sexe: sexe,
          age: age,
          effet: effet,
          poid: poid,
          taille: taille,
          allergie: allergie,
          posologie: posologie,
          dateDebutAdmin: dateDebutAdmin,
          dateFinAdmin: dateFinAdmin,
          dateDebut: dateDebut,
          dateFin: dateFin,
          information: information,
          complementaires: complementaires,
          grave: grave,
          initiales: initiales,
        }; */
      });
      exportToExcel(array);
    },
    [dispatch, exportToExcel, id]
  );
  return (
    <>
      {alert}
      <ToastContainer />
      <Container fluid>
        <Row>
          <Col md="6">
            <Button
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
          <Col md="6">
            <Button
              className="btn-wd  mr-1 float-right"
              type="button"
              variant="success"
              onClick={() => {
                getDetail(entitiesExcel);
              }}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Excel
            </Button>
          </Col>
        </Row>
        <Row>
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

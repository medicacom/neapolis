import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
/* import Button from "@mui/material/Button"; */
import Typography from "@mui/material/Typography";
// react component used to create alerts
// react-bootstrap components
import Donnes from "./Donnes";
import Patient from "./Patient";
import Effets from "./Effets";
import Medicament from "./Medicament";
import { useEffect, useCallback } from "react";
import { fetchAge } from "../../Redux/ageReduce";
import { getActiveMedicament } from "../../Redux/medicamentReduce";
import { getActiveEffet } from "../../Redux/effet_indesirableReduce";
import { getActiveIndication } from "../../Redux/indicationReduce";
import { getActiveVoix } from "../../Redux/voix_administrationReduce";
import { declarationAdded } from "../../Redux/declarationReduce";
import { useDispatch } from "react-redux";
import validator from "validator";
import { toast, ToastContainer } from "react-toastify";
import { Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";
import { useTranslation } from "react-multi-lang";

function Declaration({ obj }) {
  const t = useTranslation();
  var lang = localStorage.getItem("lang");
  var icon1 =
    lang === "ar" ? "fas fa-angle-double-left" : "fas fa-angle-double-right";
  var icon2 =
    lang === "ar" ? "fas fa-angle-double-right" : "fas fa-angle-double-left";
  var token = localStorage.getItem("x-access-token");
  var id = 0;
  var nom_prenom = "";
  if (token !== null) {
    var decoded = jwt_decode(token);
    id = decoded.id;
    nom_prenom = obj.user.nom + " " + obj.user.prenom;
  }
  const dispatch = useDispatch();
  const navigate = useHistory();
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
  const steps = [
    t("Declaration.data"),
    t("Declaration.patient"),
    t("Declaration.drugs"),
    t("Declaration.effects"),
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  //Donnes
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [specialite, setSpecialite] = React.useState({
    value: 0,
    label: "Specialite",
    isDisabled: true,
  });
  const [typeSpecialite, setTypeSpecialite] = React.useState(0);
  const [idSpecialite, setIdSpecialite] = React.useState(0);
  const [autreSp, setAutreSp] = React.useState("");
  //Patient
  const [initiales, setInitiales] = React.useState("");
  const [age, setAge] = React.useState("");
  const [sexe, setSexe] = React.useState("");
  const [dateNaissance, setDateNaissance] = React.useState("");
  const [agePatient, setAgePatient] = React.useState("");
  const [poid, setPoid] = React.useState("");
  const [taille, setTaille] = React.useState("");
  const [allergie, setAllergie] = React.useState("");
  const [ageCategorie, setAgeCategorie] = React.useState({
    value: 0,
    label: t("select"),
    isDisabled: true,
  });
  const [optionsAge, setOptionsAge] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);
  const [indication, setIndication] = React.useState({
    value: 0,
    label: t("select"),
    isDisabled: true,
  });
  const [optionsIndication, setOptionsIndication] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);

  //Effets
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [information, setInformation] = React.useState("");
  const [complementaires, setComplementaires] = React.useState("");
  const [description_eff, setDescription_eff] = React.useState("");
  const [grave, setGrave] = React.useState(0);
  const [hospitalisation, setHospitalisation] = React.useState(0);
  const [pronostic, setPronostic] = React.useState(0);
  const [incapacite, setIncapacite] = React.useState(0);
  const [anomalie, setAnomalie] = React.useState(0);
  const [deces, setDeces] = React.useState(0);
  const [autre, setAutre] = React.useState(0);
  const [evolution, setEvolution] = React.useState(0);
  const [traites, setTraites] = React.useState(0);
  const [survenus, setSurvenus] = React.useState(0);
  //Medicament
  const [medicament, setMedicament] = React.useState({
    value: 0,
    label: t("select"),
    isDisabled: true,
  });
  const [optionsMedicament, setOptionsMedicament] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);
  const [dateDebutAdmin, setDateDebutAdmin] = React.useState("");
  const [dateFinAdmin, setDateFinAdmin] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [posologie, setPosologie] = React.useState("");
  const [date_admin, setDate_admin] = React.useState("");
  const [therapeutique, setTherapeutique] = React.useState("");
  const [voix, setVoix] = React.useState({
    value: 0,
    label: t("select"),
    isDisabled: true,
  });
  const [optionsVoix, setOptionsVoix] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);
  const [effet, setEffet] = React.useState({
    value: 0,
    label: t("select"),
    isDisabled: true,
  });
  const [optionsEffet, setOptionsEffet] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);
  var token = localStorage.getItem("x-access-token");

  /** start Age **/
  const getAges = useCallback(async () => {
    var res = await dispatch(fetchAge());
    var entities = res.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var description =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: description });
    });
    setOptionsAge(arrayOption);
  }, [dispatch]);
  /** end Age **/

  /** start Indication **/
  const getIndication = useCallback(async () => {
    var res = await dispatch(getActiveIndication());
    var entities = res.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var description =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: description });
    });
    setOptionsIndication(arrayOption);
  }, [dispatch]);
  /** end Indication **/

  /** start Effet **/
  const getEffet = useCallback(async () => {
    var res = await dispatch(getActiveEffet());
    var entities = res.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var description =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: description });
    });
    setOptionsEffet(arrayOption);
  }, [dispatch]);
  /** end Effet **/

  /** start Medicament **/
  const getMedicament = useCallback(async () => {
    var res = await dispatch(getActiveMedicament());
    var entities = res.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var nomMed = lang === "fr" ? e.nom : lang === "en" ? e.nom_en : e.nom_ar;
      arrayOption.push({ value: e.id, label: nomMed });
    });
    setOptionsMedicament(arrayOption);
  }, [dispatch]);
  /** end Medicament **/

  /** start Medicament **/
  const getVoix = useCallback(async () => {
    var res = await dispatch(getActiveVoix());
    var entities = res.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var description =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: description });
    });
    setOptionsVoix(arrayOption);
  }, [dispatch]);
  /** end Medicament **/

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleComplete = () => {
    var test = true;
    var id_sp = idSpecialite;
    var id_indication = indication.value;
    var id_eff = effet.value;
    var id_medicament = medicament.value;
    var id_voix = voix.value;
    if (activeStep == 0) {
      if (
        validator.isEmpty(nom) ||
        validator.isEmpty(prenom) ||
        validator.isEmpty(email) ||
        id_sp === 0
      ) {
        notify(2, t("erreur"));
        test = false;
      }
    } else if (activeStep == 1) {
      if (
        validator.isEmpty(initiales) ||
        sexe === "" ||
        age === "" ||
        (age === 1 && validator.isEmpty(dateNaissance)) ||
        (age === 2 && validator.isEmpty(agePatient)) ||
        (age === 3 && ageCategorie.value === 0) ||
        id_indication === 0
      ) {
        notify(2, t("erreur"));
        test = false;
      }
    } else if (activeStep == 2) {
      if (
        validator.isEmpty(dateDebutAdmin) ||
        validator.isEmpty(dateFinAdmin) ||
        validator.isEmpty(numero) ||
        validator.isEmpty(posologie) ||
        id_voix === 0 ||
        id_medicament === 0
      ) {
        notify(2, t("erreur"));
        test = false;
      }
    } else if (activeStep == 3) {
      if (
        validator.isEmpty(dateDebut) ||
        validator.isEmpty(dateFin) ||
        validator.isEmpty(information) ||
        validator.isEmpty(complementaires) ||
        id_eff === 0
      ) {
        notify(2, t("erreur"));
        test = false;
      } else {
        dispatch(
          declarationAdded({
            id_user: id,
            nom: nom,
            prenom: prenom,
            tel: tel,
            email: email,
            id_sp: id_sp,
            initiales: initiales,
            age: age,
            sexe: sexe,
            dateNaissance: dateNaissance,
            agePatient: agePatient,
            ageCategorie: ageCategorie.value,
            id_indication: id_indication,
            id_eff: id_eff,
            dateDebut: dateDebut,
            dateFin: dateFin,
            information: information,
            complementaires: complementaires,
            id_medicament: id_medicament,
            dateDebutAdmin: dateDebutAdmin,
            dateFinAdmin: dateFinAdmin,
            id_voix: id_voix,
            numero: numero,
            posologie: posologie,
            grave: grave,
            hospitalisation: hospitalisation,
            pronostic: pronostic,
            incapacite: incapacite,
            anomalie: anomalie,
            autre: autre,
            evolution: evolution,
            traites: traites,
            survenus: survenus,
            deces: deces,
            date_admin: date_admin,
            therapeutique: therapeutique,
            description_eff: description_eff,
            poid: poid,
            taille: taille,
            allergie: allergie,
          })
        ).then(() => {
          notify(1, t("declaration_send"));
          setTimeout(async () => {
            if (token === null) {
              navigate.push("/login");
            } else {
              navigate.push("/listDeclaration");
            }
            /* window.location.reload(); */
          }, 1500);
        });
      }
    }

    if (test) {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      if (activeStep < 3) handleNext();
    }
  };

  useEffect(() => {
    getAges();
    getIndication();
    getEffet();
    getMedicament();
    getVoix();
    if (token !== null) {
      var newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    }
  }, [getAges, getIndication, getEffet, getMedicament, getVoix]);

  const onClick = () => {
    if (token === null) {
      navigate.push("/login");
    } else {
      navigate.push("/listDeclaration");
    }
  };

  const handleBack = () => {
    var newCompleted = completed;
    delete newCompleted[activeStep - 1];
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <ToastContainer />
      <div className={lang === "ar" ? "dec-ar declaration" : "declaration"}>
        <Row>
          <Col md="6" sm="6" xs="6">
            <img src={require("../../assets/img/logo.png")} alt="medicacom" />
          </Col>
          <Col md="6" sm="6" xs="6">
            <div className="flag">
              <img
                src={require("../../assets/img/en.png")}
                alt="en"
                onClick={(e) => {
                  window.localStorage.setItem("lang", "en");
                  window.location.reload();
                }}
              />
              <img
                src={require("../../assets/img/fr.png")}
                alt="fr"
                onClick={(e) => {
                  window.localStorage.setItem("lang", "fr");
                  window.location.reload();
                }}
              />
              <img
                src={require("../../assets/img/ar.png")}
                alt="ar"
                onClick={(e) => {
                  window.localStorage.setItem("lang", "ar");
                  window.location.reload();
                }}
              />
            </div>
            <Button
              className={
                lang === "ar"
                  ? "btn-fill float-left btn-declaration"
                  : "btn-fill float-right btn-declaration"
              }
              type="button"
              variant="success"
              onClick={onClick}
            >
              {token !== null ? nom_prenom : t("sign_in")}
            </Button>
          </Col>
        </Row>
        <Box sx={{ width: "100%" }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit">{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                {activeStep === 0 ? (
                  <Donnes
                    nom={nom}
                    setNom={setNom}
                    prenom={prenom}
                    setPrenom={setPrenom}
                    tel={tel}
                    setTel={setTel}
                    email={email}
                    setEmail={setEmail}
                    specialite={specialite}
                    setSpecialite={setSpecialite}
                    password={password}
                    setPassword={setPassword}
                    idSpecialite={idSpecialite}
                    setIdSpecialite={setIdSpecialite}
                    typeSpecialite={typeSpecialite}
                    setTypeSpecialite={setTypeSpecialite}
                    autreSp={autreSp}
                    setAutreSp={setAutreSp}
                  ></Donnes>
                ) : activeStep === 1 ? (
                  <Patient
                    initiales={initiales}
                    setInitiales={setInitiales}
                    age={age}
                    setAge={setAge}
                    sexe={sexe}
                    setSexe={setSexe}
                    dateNaissance={dateNaissance}
                    setDateNaissance={setDateNaissance}
                    agePatient={agePatient}
                    setAgePatient={setAgePatient}
                    optionsAge={optionsAge}
                    ageCategorie={ageCategorie}
                    setAgeCategorie={setAgeCategorie}
                    optionsIndication={optionsIndication}
                    indication={indication}
                    setIndication={setIndication}
                    poid={poid}
                    setPoid={setPoid}
                    taille={taille}
                    setTaille={setTaille}
                    allergie={allergie}
                    setAllergie={setAllergie}
                  ></Patient>
                ) : activeStep === 2 ? (
                  <Medicament
                    optionsMedicament={optionsMedicament}
                    medicament={medicament}
                    setMedicament={setMedicament}
                    dateDebutAdmin={dateDebutAdmin}
                    setDateDebutAdmin={setDateDebutAdmin}
                    dateFinAdmin={dateFinAdmin}
                    setDateFinAdmin={setDateFinAdmin}
                    optionsVoix={optionsVoix}
                    voix={voix}
                    setVoix={setVoix}
                    numero={numero}
                    setNumero={setNumero}
                    posologie={posologie}
                    setPosologie={setPosologie}
                    date_admin={date_admin}
                    setDate_admin={setDate_admin}
                    therapeutique={therapeutique}
                    setTherapeutique={setTherapeutique}
                    optionsEffet={optionsEffet}
                    effet={effet}
                    setEffet={setEffet}
                  ></Medicament>
                ) : (
                  <Effets
                    description_eff={description_eff}
                    setDescription_eff={setDescription_eff}
                    dateDebut={dateDebut}
                    setDateDebut={setDateDebut}
                    dateFin={dateFin}
                    setDateFin={setDateFin}
                    information={information}
                    setInformation={setInformation}
                    complementaires={complementaires}
                    setComplementaires={setComplementaires}
                    grave={grave}
                    setGrave={setGrave}
                    hospitalisation={hospitalisation}
                    setHospitalisation={setHospitalisation}
                    pronostic={pronostic}
                    setPronostic={setPronostic}
                    incapacite={incapacite}
                    setIncapacite={setIncapacite}
                    anomalie={anomalie}
                    setAnomalie={setAnomalie}
                    autre={autre}
                    setAutre={setAutre}
                    evolution={evolution}
                    setEvolution={setEvolution}
                    traites={traites}
                    setTraites={setTraites}
                    survenus={survenus}
                    setSurvenus={setSurvenus}
                    deces={deces}
                    setDeces={setDeces}
                  ></Effets>
                )}
              </Typography>
            </React.Fragment>
          </div>
        </Box>
        <Row>
          <Col md="6" sm="6" xs="6">
            <div className="handleBack">
              {activeStep !== 0 ? (
                <Button
                  disabled={activeStep === 1 && token !== null ? true : false}
                  className="btn-fill"
                  type="button"
                  variant="success"
                  onClick={handleBack}
                >
                  <i class={icon2}></i>
                  {t("back")}
                </Button>
              ) : (
                ""
              )}
            </div>
          </Col>
          <Col md="6" sm="6" xs="6">
            <div className="submit-dec">
              <Button
                className="btn-fill"
                type="button"
                variant="success"
                onClick={handleComplete}
              >
                {activeStep === 3 ? t("envoyer") : t("next")}
                <i class={activeStep < 3 ? icon1 : ""}></i>
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Declaration;

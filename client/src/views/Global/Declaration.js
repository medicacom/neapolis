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
import { useTranslation } from 'react-multi-lang'

function Declaration({ obj }) {
  const t = useTranslation()
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
    t('Declaration.data'),
    t('Declaration.suspect'),
    t('Declaration.drugs'),
    t('Declaration.effects'),
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
  });
  //Patient
  const [initiales, setInitiales] = React.useState("");
  const [age, setAge] = React.useState("");
  const [sexe, setSexe] = React.useState("");
  const [dateNaissance, setDateNaissance] = React.useState("");
  const [agePatient, setAgePatient] = React.useState("");
  const [ageCategorie, setAgeCategorie] = React.useState({
    value: 0,
    label: "Age",
  });
  const [optionsAge, setOptionsAge] = React.useState([
    {
      value: 0,
      label: "Age",
      isDisabled: true,
    },
  ]);
  const [indication, setIndication] = React.useState({
    value: 0,
    label: t("select"),
  });
  const [optionsIndication, setOptionsIndication] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);

  //Effets
  const [effet, setEffet] = React.useState({
    value: 0,
    label: t("select"),
  });
  const [optionsEffet, setOptionsEffet] = React.useState([
    {
      value: 0,
      label: t("select"),
      isDisabled: true,
    },
  ]);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [information, setInformation] = React.useState("");
  const [complementaires, setComplementaires] = React.useState("");
  //Medicament
  const [medicament, setMedicament] = React.useState({
    value: 0,
    label: t("select"),
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
  const [voix, setVoix] = React.useState({
    value: 0,
    label: t("select"),
  });
  const [optionsVoix, setOptionsVoix] = React.useState([
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
    arrayOption.push({ value: 0, label: "Age" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.description });
    });
    setOptionsAge(arrayOption);
  }, [dispatch]);
  /** end Age **/

  /** start Indication **/
  const getIndication = useCallback(async () => {
    var res = await dispatch(getActiveIndication());
    var entities = res.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Indication" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.description });
    });
    setOptionsIndication(arrayOption);
  }, [dispatch]);
  /** end Indication **/

  /** start Effet **/
  const getEffet = useCallback(async () => {
    var res = await dispatch(getActiveEffet());
    var entities = res.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Effet indesirables" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.description });
    });
    setOptionsEffet(arrayOption);
  }, [dispatch]);
  /** end Effet **/

  /** start Medicament **/
  const getMedicament = useCallback(async () => {
    var res = await dispatch(getActiveMedicament());
    var entities = res.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Medicament" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionsMedicament(arrayOption);
  }, [dispatch]);
  /** end Medicament **/

  /** start Medicament **/
  const getVoix = useCallback(async () => {
    var res = await dispatch(getActiveVoix());
    var entities = res.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Administré" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.description });
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
    var id_sp = specialite.value;
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
        notify(2, "Vérifier vos donnée");
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
        notify(2, "Vérifier vos donnée");
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
        notify(2, "Vérifier vos donnée");
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
        notify(2, "Vérifier vos donnée");
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
          })
        ).then((data) => {
          notify(1, "Insertion avec succes");
          setTimeout(async () => {
            window.location.reload();
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
    delete newCompleted[activeStep - 1]
    setCompleted(newCompleted);    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <ToastContainer />
      <div className="declaration">
        <Row>
          <Col md="6">
            <img src={require("../../assets/img/logo.png")} alt="medicacom" />
          </Col>
          <Col md="6">
            <Button
              className="btn-fill float-right"
              type="button"
              variant="success"
              onClick={onClick}
            >
              {token !== null ? nom_prenom : t('sign-in')}
            </Button>
          </Col>
        </Row>
        <Box sx={{ width: "100%" }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit">
                  {label}
                </StepButton>
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
                  ></Medicament>
                ) : (
                  <Effets
                    optionsEffet={optionsEffet}
                    effet={effet}
                    setEffet={setEffet}
                    dateDebut={dateDebut}
                    setDateDebut={setDateDebut}
                    dateFin={dateFin}
                    setDateFin={setDateFin}
                    information={information}
                    setInformation={setInformation}
                    complementaires={complementaires}
                    setComplementaires={setComplementaires}
                  ></Effets>
                )}
              </Typography>
            </React.Fragment>
          </div>
        </Box>
        <Row>
          <Col md="6">
            <div className="handleBack">
              <Button
                disabled={activeStep === 0?true:false}
                className="btn-fill"
                type="button"
                variant="success"
                onClick={handleBack}
              >
                <i class="fas fa-angle-double-left"></i>
                  {t('back')}
              </Button>
            </div>
          </Col>
          <Col md="6">
            <div className="submit-dec">
              <Button
                className="btn-fill"
                type="button"
                variant="success"
                onClick={handleComplete}
              >
                {activeStep === 3 ? t('save') : t('next')}
                <i class={activeStep < 3 ?"fas fa-angle-double-right" : "fas fa-save"}></i>
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Declaration;

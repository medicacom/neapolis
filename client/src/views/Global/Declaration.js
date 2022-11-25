import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
/* import Button from "@mui/material/Button"; */
import Typography from "@mui/material/Typography";
// react component used to create alerts
// react-bootstrap components
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
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

function Declaration() {
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
  const steps = ["1", "2", "3", "4"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  //step1
  const [nom, setNom] = React.useState("");
  const [prenom, setPrenom] = React.useState("");
  const [tel, setTel] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [specialite, setSpecialite] = React.useState({
    value: 0,
    label: "Specialite",
  });
  //step2
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
    label: "--Choissisez dans cette liste --",
  });
  const [optionsIndication, setOptionsIndication] = React.useState([
    {
      value: 0,
      label: "--Choissisez dans cette liste --",
      isDisabled: true,
    },
  ]);

  //step3
  const [effet, setEffet] = React.useState({
    value: 0,
    label: "--Choissisez dans cette liste --",
  });
  const [optionsEffet, setOptionsEffet] = React.useState([
    {
      value: 0,
      label: "--Choissisez dans cette liste --",
      isDisabled: true,
    },
  ]);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [information, setInformation] = React.useState("");
  const [complementaires, setComplementaires] = React.useState("");
  //step4
  const [medicament, setMedicament] = React.useState({
    value: 0,
    label: "--Choissisez dans cette liste --",
  });
  const [optionsMedicament, setOptionsMedicament] = React.useState([
    {
      value: 0,
      label: "--Choissisez dans cette liste --",
      isDisabled: true,
    },
  ]);
  const [dateDebutAdmin, setDateDebutAdmin] = React.useState("");
  const [dateFinAdmin, setDateFinAdmin] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [posologie, setPosologie] = React.useState("");
  const [voix, setVoix] = React.useState({
    value: 0,
    label: "--Choissisez dans cette liste --",
  });
  const [optionsVoix, setOptionsVoix] = React.useState([
    {
      value: 0,
      label: "--Choissisez dans cette liste --",
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    /* var list = completed[index]; */
    var list = { ...completed };
    list[step] = true;
    setCompleted(list);
    setActiveStep(step);
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
        validator.isEmpty(dateDebut) ||
        validator.isEmpty(dateFin) ||
        validator.isEmpty(information) ||
        validator.isEmpty(complementaires) ||
        id_eff === 0
      ) {
        notify(2, "Vérifier vos donnée");
        test = false;
      }
    } else if (activeStep == 3) {
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
      } else {
        dispatch(
          declarationAdded({
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
            password: password,
          })
        ).then((data) => {
          if (data.payload === true) notify(1, "Insertion avec succes");
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

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
    getAges();
    getIndication();
    getEffet();
    getMedicament();
    getVoix();
  }, [getAges, getIndication, getEffet, getMedicament, getVoix]);

  const onClick = () => {
    if(token === null) {
      navigate.push("/login");
    } else {      
      navigate.push("/profile");
    }
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
              {token !== null ? "Retour à la liste" : "Se connecter"}
              {/* {completedSteps() === totalSteps() - 1 ? "Submit" : "Suivant"} */}
            </Button>
          </Col>
        </Row>
        <Box sx={{ width: "100%" }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" /* onClick={handleStep(index)} */>
                  {/* {label} */}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                {/* Step {activeStep + 1} */}
                {activeStep === 0 ? (
                  <Step1
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
                  ></Step1>
                ) : activeStep === 1 ? (
                  <Step2
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
                  ></Step2>
                ) : activeStep === 2 ? (
                  <Step3
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
                  ></Step3>
                ) : (
                  <Step4
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
                  ></Step4>
                )}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {/* <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  onClick={handleNext}
                  sx={{ mr: 1 }}
                  disabled={activeStep === 3}
                >
                  Next
                </Button> */}
              </Box>
            </React.Fragment>
            {/* {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (""
            )} */}
          </div>
        </Box>
        <div className="submit-dec">
          <Button
            className="btn-fill"
            type="button"
            variant="success"
            onClick={handleComplete}
          >
            {activeStep === 3 ? "Enregistrer" : "Suivant"}
            {/* {completedSteps() === totalSteps() - 1 ? "Submit" : "Suivant"} */}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Declaration;

import React, { useEffect, useCallback } from "react";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import {
  medicamentAdded,
  medicamentGetById,
} from "../../../Redux/medicamentReduce";
import { getActiveVoix } from "../../../Redux/voix_administrationReduce";
import { getActiveIndication } from "../../../Redux/indicationReduce";
import { fetchPays } from "../../../Redux/paysReduce";
import Select from "react-select";

import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb/with-async-ittr";
import { useTranslation } from "react-multi-lang";
function AjouterMedicament({ onlineStatus }) {
  const t = useTranslation();
  let lang = window.localStorage.getItem("lang");
  let db;
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
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useHistory();
  const [dosage, setDosage] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [nomEn, setNomEn] = React.useState("");
  const [nomAr, setNomAr] = React.useState("");
  const [form, setForm] = React.useState("");
  const [id, setId] = React.useState(0);

  const [optionsVoix, setOptionsVoix] = React.useState([
    {
      value: "",
      label: lang === "fr" ? "Voix" : lang === "en" ? "Voice" : "صوت",
      isDisabled: true,
    },
  ]);
  const [voixSelect, setVoixSelect] = React.useState({
    value: 0,
    label: lang === "fr" ? "Voix" : lang === "en" ? "Voice" : "صوت",
  });

  const [optionsPays, setOptionsPays] = React.useState([
    {
      value: "",
      label: lang === "fr" ? "Pays" : lang === "en" ? "Country" : "دولة",
      isDisabled: true,
    },
  ]);
  const [paysSelect, setPaysSelect] = React.useState({
    value: 0,
    label: lang === "fr" ? "Pays" : lang === "en" ? "Country" : "دولة",
  });

  const [optionsIndication, setOptionsIndication] = React.useState([
    {
      value: "",
      label: lang === "ar" ? "دلالة" : "Indication",
      isDisabled: true,
    },
  ]);
  const [indicationSelect, setIndicationSelect] = React.useState({
    value: 0,
    label: lang === "ar" ? "دلالة" : "Indication",
  });

  async function saveMedicamentIndex() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("medicaments", "readwrite");
    if (isNaN(location.id) === false) {
      const index = tx.store.index("id");
      for await (const cursor of index.iterate(parseInt(location.id))) {
        var objMedicament = { ...cursor.value };
        objMedicament.nom = nom;
        objMedicament.form = form;
        objMedicament.dosage = dosage;
        objMedicament.id_voix = voixSelect.value;
        objMedicament.nom_voix = voixSelect.label;
        objMedicament.id_indication = indicationSelect.value;
        objMedicament.nom_indication = indicationSelect.label;
        objMedicament.updated = 1;
        objMedicament.etat = 1;
        cursor.update(objMedicament);
      }
      await tx.done;
      notify(1, t("update_txt"));
    } else {
      let medicamentStore = tx.objectStore("medicaments");
      let medicament = await medicamentStore.getAll();
      await tx.objectStore("medicaments").add({
        nom: nom,
        nom_en: nomEn,
        nom_ar: nomAr,
        form: form,
        dosage: dosage,
        id_voix: voixSelect.value,
        nom_voix: voixSelect.label,
        id_indication: indicationSelect.value,
        nom_indication: indicationSelect.label,
        id_pays: paysSelect.value,
        type_table: 4,
        saved: 0,
        etat: 1,
        id:
          medicament.length !== 0
            ? medicament[medicament.length - 1].id + 1
            : 1,
      });
      notify(1, t("add_txt"));
    }

    setTimeout(async () => {
      listeMedicament();
    }, 1500);
  }
  function submitForm() {
    if (onlineStatus === 1) {
      var id_voix = voixSelect.value;
      var id_indication = indicationSelect.value;
      var id_pays = paysSelect.value;
      if (
        nom !== "" &&
        form !== "" &&
        dosage !== "" &&
        id_indication !== 0 &&
        id_voix !== 0 &&
        id_pays !== 0
      ) {
        dispatch(
          medicamentAdded({
            nom,
            nomAr,
            nomEn,
            form,
            dosage,
            id_voix,
            id_indication,
            id_pays,
            id,
          })
        ).then((val) => {
          if (val.payload.msg === true) {
            if (isNaN(location.id) === true) {
              notify(1, t("add_txt"));
            } else {
              notify(1, t("update_txt"));
            }
          } else {
            notify(2, t("problem"));
          }

          setTimeout(async () => {
            listeMedicament();
          }, 1500);
        });
      } else {
        notify(2, t("erreur"));
      }
    } else {
      if (
        nom !== "" &&
        form !== "" &&
        dosage !== "" &&
        indicationSelect.value !== 0 &&
        voixSelect.value !== 0 &&
        paysSelect.value !== 0
      ) {
        saveMedicamentIndex();
      } else {
        notify(2, t("erreur"));
      }
    }
  }

  /** start getIndication **/
  const getIndication = useCallback(async () => {
    var role = await dispatch(getActiveIndication());
    var entities = role.payload;
    var arrayOption = [];
    var label = lang === "ar" ? "دلالة" : "Indication";
    arrayOption.push({ value: 0, label: label });
    entities.forEach((e) => {
      var desc =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: desc });
    });
    setOptionsIndication(arrayOption);
  }, [dispatch]);

  const initIndication = useCallback(async () => {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("indications", "readwrite");
    let voixStore = tx.objectStore("indications");
    let entities = await voixStore.getAll();
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Indications" });
    entities.forEach((e) => {
      if (e.etat === 1) arrayOption.push({ value: e.id, label: e.description });
    });
    setOptionsIndication(arrayOption);
  }, []);

  /** start getIndication **/

  /** start getVoix **/

  const getVoix = useCallback(async () => {
    var role = await dispatch(getActiveVoix());
    var entities = role.payload;
    var arrayOption = [];
    var label = lang === "fr" ? "Voix" : lang === "en" ? "Voice" : "صوت";
    arrayOption.push({ value: 0, label: label });
    entities.forEach((e) => {
      var desc =
        lang === "fr"
          ? e.description
          : lang === "en"
          ? e.description_en
          : e.description_ar;
      arrayOption.push({ value: e.id, label: desc });
    });
    setOptionsVoix(arrayOption);
  }, [dispatch]);

  const initVoix = useCallback(async () => {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("voix_administrations", "readwrite");
    let voixStore = tx.objectStore("voix_administrations");
    let entities = await voixStore.getAll();
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Voix" });
    entities.forEach((e) => {
      if (e.etat === 1) arrayOption.push({ value: e.id, label: e.description });
    });
    setOptionsVoix(arrayOption);
  }, []);

  /** end getVoix **/

  /** start getPays **/

  const getPays = useCallback(async () => {
    var req = await dispatch(fetchPays());
    var entities = req.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      var desc = e.nom_en;
      arrayOption.push({ value: e.id, label: desc });
    });
    setOptionsPays(arrayOption);
  }, [dispatch]);

  const initPays = useCallback(async () => {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("pays", "readwrite");
    let voixStore = tx.objectStore("pays");
    let entities = await voixStore.getAll();
    var arrayOption = [];
    entities.forEach((e) => {
      var desc = e.nom_en;
      arrayOption.push({ value: e.id, label: desc });
    });
    setOptionsPays(arrayOption);
  }, []);

  /** end getVoix **/

  /** start get medicament by id **/
  async function initMedicament() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("medicaments", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(location.id))) {
      var objMedicament = { ...cursor.value };
      setDosage(objMedicament.dosage);
      setNom(objMedicament.nom);
      setForm(objMedicament.form);
      setIndicationSelect({
        value: objMedicament.id_indication,
        label: objMedicament.nom_indication,
      });
      setVoixSelect({
        value: objMedicament.id_voix,
        label: objMedicament.nom_voix,
      });
      setId(objMedicament);
    }
    await tx.done;
  }

  const getMedicament = useCallback(async () => {
    var medicament = await dispatch(medicamentGetById(location.id));
    var entities = medicament.payload;
    setNom(entities.nom);
    setNomAr(entities.nom_ar);
    setNomEn(entities.nom_en);
    setDosage(entities.dosage);
    setForm(entities.form);
    setIndicationSelect({
      value: entities.indications.id,
      label: entities.indications.description,
    });
    setVoixSelect({
      value: entities.voix_administrations.id,
      label: entities.voix_administrations.description,
    });
    setPaysSelect({
      value: entities.pays.id,
      label: entities.pays.nom_en,
    });
    setId(location.id);
  }, [dispatch]);

  /** end get medicament by id **/

  useEffect(() => {
    if (onlineStatus === 1) {
      getVoix();
      getIndication();
      getPays();
      if (isNaN(location.id) === false) getMedicament();
    } else {
      initIndication();
      initVoix();
      initPays();
      if (isNaN(location.id) === false) initMedicament();
    }
  }, [location.id, dispatch]);

  function listeMedicament() {
    navigate.push("/listMedicament");
  }
  return (
    <>
      <Container fluid>
        <ToastContainer />
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd  mr-1 float-left"
                  type="button"
                  variant="success"
                  onClick={listeMedicament}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  {t("list")}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? t("Drugs.add")
                            : t("Drugs.update")}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("name")}* </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder={t("name")}
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("name")} EN* </label>
                            <Form.Control
                              defaultValue={nomEn}
                              placeholder={t("name") + "EN"}
                              type="text"
                              onChange={(value) => {
                                setNomEn(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("name")} AR* </label>
                            <Form.Control
                              defaultValue={nomAr}
                              placeholder={t("name") + "AR"}
                              type="text"
                              onChange={(value) => {
                                setNomAr(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("Drugs.dosage")}* </label>
                            <Form.Control
                              defaultValue={dosage}
                              placeholder={t("Drugs.dosage")}
                              type="text"
                              onChange={(value) => {
                                setDosage(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("Drugs.indication")}* </label>
                            <Select
                              placeholder={t("Drugs.indication")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={indicationSelect}
                              onChange={(value) => {
                                setIndicationSelect(value);
                              }}
                              options={optionsIndication}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("Drugs.voice")}* </label>
                            <Select
                              placeholder={t("Drugs.voice")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={voixSelect}
                              onChange={(value) => {
                                setVoixSelect(value);
                              }}
                              options={optionsVoix}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>{t("Drugs.form")}* </label>
                            <Form.Control
                              defaultValue={form}
                              placeholder={t("Drugs.form")}
                              type="text"
                              onChange={(value) => {
                                setForm(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>{t("Drugs.country")}* </label>
                            <Select
                              placeholder={t("Drugs.country")}
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={paysSelect}
                              onChange={(value) => {
                                setPaysSelect(value);
                              }}
                              options={optionsPays}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="success"
                        onClick={submitForm}
                      >
                        {t("save")}
                      </Button>
                      <div className="clearfix"></div>
                    </Card.Body>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default AjouterMedicament;

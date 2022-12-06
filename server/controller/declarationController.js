const express = require("express");
const router = express.Router();
var patient = require("../models/patient");
var rapport = require("../models/rapport");
const auth = require("../middlewares/passport");
const user = require("../models/user");
const passager = require("../models/passager");
const sendMail = require("./sendMailController");

router.post("/addDeclaration", (req, res) => {
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var tel = req.body.tel;
  var email = req.body.email;
  var id_sp = req.body.id_sp;
  var initiales = req.body.initiales;
  var age = req.body.age;
  var sexe = req.body.sexe;
  var dateNaissance = req.body.dateNaissance;
  var agePatient = req.body.agePatient;
  var ageCategorie = req.body.ageCategorie;
  var id_indication = req.body.id_indication;
  var id_eff = req.body.id_eff;
  var dateDebut = req.body.dateDebut;
  var dateFin = req.body.dateFin;
  var information = req.body.information;
  var complementaires = req.body.complementaires;
  var id_medicament = req.body.id_medicament;
  var dateDebutAdmin = req.body.dateDebutAdmin;
  var dateFinAdmin = req.body.dateFinAdmin;
  var id_voix = req.body.id_voix;
  var id_user = req.body.id_user;
  var posologie = req.body.posologie;
  var numero = req.body.numero;

  if (id_user != 0) {
    patient
      .create({
        id_user: id_user,
        initiales: initiales,
        age: age,
        sexe: sexe,
        dateNaissance: dateNaissance,
        agePatient: agePatient,
        ageCategorie: ageCategorie != 0 ? ageCategorie : null,
        id_indication: id_indication,
      })
      .then((p) => {
        rapport
          .create({
            id_user: id_user,
            id_patient: p.id,
            id_eff: id_eff,
            dateDebut: dateDebut,
            dateFin: dateFin,
            information: information,
            complementaires: complementaires,
            id_medicament: id_medicament,
            dateDebutAdmin: dateDebutAdmin,
            dateFinAdmin: dateFinAdmin,
            id_voix: id_voix,
            posologie: posologie,
            numero: numero,
          })
          .then((r) => {
            user.findOne({ where: { id_role: 1 } }).then(function (u) {
              var msg = "";
              var txt = "Il y a une nouvelle déclaration";
              msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
              sendMail("Déclaration", msg, u.email, u.nom);
              return res.status(200).send(true);
            });
          });
      })
      .catch((error) => {
        return res.status(403).send(error);
      });
  } else {
    passager
      .create({
        nom: nom,
        prenom: prenom,
        tel: tel,
        email: email,
        id_sp: id_sp,
      })
      .then((pa) => {
        patient
          .create({
            id_passager: pa.id,
            initiales: initiales,
            age: age,
            sexe: sexe,
            dateNaissance: dateNaissance,
            agePatient: agePatient,
            ageCategorie: ageCategorie != 0 ? ageCategorie : null,
            id_indication: id_indication,
          })
          .then((p) => {
            rapport
              .create({
                id_patient: p.id,
                id_eff: id_eff,
                dateDebut: dateDebut,
                dateFin: dateFin,
                information: information,
                complementaires: complementaires,
                id_medicament: id_medicament,
                dateDebutAdmin: dateDebutAdmin,
                dateFinAdmin: dateFinAdmin,
                id_voix: id_voix,
                posologie: posologie,
                numero: numero,
              })
              .then((r) => {
                user.findOne({ where: { id_role: 1 } }).then(function (u) {
                  var msg = "";
                  var txt = "Il y a une nouvelle déclaration";
                  msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
                  sendMail("Déclaration", msg, u.email, u.nom);
                  return res.status(200).send(true);
                });
              });
          })
          .catch((error) => {
            return res.status(403).send(error);
          });
      })
      .catch((error) => {
        return res.status(403).send(error);
      });
  }
});

router.get("/getDeclarations/:id_role/:id", auth, (req, res) => {
  var id_role = req.params.id_role;
  var id = req.params.id;
  var where = id_role == 2 ? { id: id } : {};
  rapport
    .findAll({
      include: [
        "medicaments",
        "effet_indesirables",
        "voix_administrations",
        {
          model: user,
          as: "users",
          where:where,
          include: ["specialites"],
        },
        {
          model: patient,
          as: "patients",
          include: [
            "ages",
            "indications",
            {
              model: passager,
              as: "passagers",
              include: ["specialites"],
            },
          ],
        },
      ],
    })
    .then(function (r) {
      return res.status(200).send(r);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getDeclarationsById/:id", auth, (req, res) => {
  var id = req.params.id;
  rapport
    .findOne({
      where: { id: id },
      include: [
        "medicaments",
        "effet_indesirables",
        "voix_administrations",
        {
          model: user,
          as: "users",
          include: ["specialites"],
        },
        {
          model: patient,
          as: "patients",
          include: [
            "ages",
            "indications",
            {
              model: passager,
              as: "passagers",
              include: ["specialites"],
            },
          ],
        },
      ],
    })
    .then(function (r) {
      return res.status(200).send(r);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
var patient = require("../models/patient");
var rapport = require("../models/rapport");
const auth = require("../middlewares/passport");
const user = require("../models/user");
const sendMail = require("./sendMailController");
router.post("/addDeclaration", auth, (req, res) => {
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
  var password = req.body.password;

  user
    .create({
      id_role: 2,
      password: nom,
      login: nom,
      nom: nom,
      prenom: prenom,
      tel: tel,
      email: email,
      id_sp: id_sp,
      etat: 1,
      password: password,
      valider: 0,
    })
    .then((u) => {
      patient
        .create({
          id_user: u.id,
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
              id_user: u.id,
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
            })
            .then((r) => {
              user.findOne({ where: { etat: 1 } }).then(function (u) {
                var msg = "";
                var txt = "Il y a une nouvelle déclaration";
                msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
                sendMail("Inscription", msg, u.email, u.nom);
                return res.status(200).send(true);
              });
            });
        })
        .catch((error) => {
          return res.status(403).send(error);
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send(error);
    });
});
router.post("/getDeclarations", auth, (req, res) => {
  rapport.findAll({ include: ["users", "patients", "medicaments"] }).then(function (r) {
    return res.status(200).send(r);
  });
});

module.exports = router;

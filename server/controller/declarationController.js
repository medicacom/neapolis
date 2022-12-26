const express = require("express");
const router = express.Router();
var patient = require("../models/patient");
var notification = require("../models/notification");
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
  /* var id_eff = req.body.id_eff; */
  var effet = req.body.effet;
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
  var grave = req.body.grave;
  var nom = req.body.nom;
  var hospitalisation = req.body.hospitalisation;
  var pronostic = req.body.pronostic;
  var incapacite = req.body.incapacite;
  var anomalie = req.body.anomalie;
  var autre = req.body.autre;
  var evolution = req.body.evolution;
  var traites = req.body.traites;
  var survenus = req.body.survenus;
  var deces = req.body.deces;
  var date_admin = req.body.date_admin;
  var therapeutique = req.body.therapeutique;
  var description_eff = req.body.description_eff;
  var poid = req.body.poid;
  var taille = req.body.taille;
  var allergie = req.body.allergie;
  var lang = req.body.lang;

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
        poid: poid,
        taille: taille,
        allergie: allergie,
      })
      .then((p) => {
        rapport
          .create({
            id_user: id_user,
            id_patient: p.id,
            effet: effet,
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
            poid: poid !== 0 ? poid : null,
            taille: taille !== 0 ? taille : null,
            allergie: allergie,
          })
          .then((r) => {
            user.findAll({ where: { id_role: [1, 3] } }).then(function (u) {
              /* var hi =
                lang == "fr"
                  ? `Bonjour ${u.nom} ,`
                  : lang == "en"
                  ? `Hello ${u.nom} ,`
                  : ` ${u.nom} مرحبا`; */
              var msg = "";
              var txt =
                lang == "fr"
                  ? "Neapolis | Nouvelle déclaration"
                  : lang == "en"
                  ? "Neapolis | New declaration"
                  : "Neapolis | بيان جديد";
              msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
              var subject =
                lang == "fr"
                  ? "Sujet: " + txt
                  : lang == "en"
                  ? "Subject: " + txt
                  : txt + ` :موضوع`;
              var arrayNotif = []; 
              u.forEach((element) => {
                var hi =
                  lang == "fr"
                    ? `Bonjour ${
                        element.dataValues.nom + " " + element.dataValues.prenom
                      } ,`
                    : lang == "en"
                    ? `Hello ${
                        element.dataValues.nom + " " + element.dataValues.prenom
                      } ,`
                    : ` ${
                        element.dataValues.nom + " " + element.dataValues.prenom
                      } مرحبا`;
                sendMail(subject, msg, element.dataValues.email, hi, [], lang);
                arrayNotif.push({
                  id_user: element.dataValues.id,
                  text: "Nouvelle déclaration",
                  text_ar: "بيان جديد",
                  text_en: "New declaration",
                  etat: 3,
                });
              });
              notification.bulkCreate(arrayNotif).then(() => {});
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
            poid: poid,
            taille: taille,
            allergie: allergie,
          })
          .then((p) => {
            rapport
              .create({
                id_passager: pa.id,
                id_patient: p.id,
                effet: effet,
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
              .then((r) => {
                user.findAll({ where: { id_role: [1, 3] } }).then(function (u) {
                  /* var hi =
                    lang == "fr"
                      ? `Bonjour ${u.nom} ,`
                      : lang == "en"
                      ? `Hello ${u.nom} ,`
                      : ` ${u.nom} مرحبا`; */
                  var msg = "";
                  var txt =
                    lang == "fr"
                      ? "Neapolis | Nouvelle déclaration"
                      : lang == "en"
                      ? "Neapolis | New declaration"
                      : "Neapolis | بيان جديد";
                  msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
                  var subject =
                    lang == "fr"
                      ? "Sujet: " + txt
                      : lang == "en"
                      ? "Subject: " + txt
                      : txt + ` :موضوع`;
                  var arrayNotif = [];
                  u.forEach((element) => {
                    var hi =
                      lang == "fr"
                        ? `Bonjour ${
                            element.dataValues.nom +
                            " " +
                            element.dataValues.prenom
                          } ,`
                        : lang == "en"
                        ? `Hello ${
                            element.dataValues.nom +
                            " " +
                            element.dataValues.prenom
                          } ,`
                        : ` ${
                            element.dataValues.nom +
                            " " +
                            element.dataValues.prenom
                          } مرحبا`;
                    sendMail(subject, msg, element.dataValues.email, hi, [], lang);
                    arrayNotif.push({
                      id_user: element.dataValues.id,
                      text: "Nouvelle déclaration",
                      text_ar: "بيان جديد",
                      text_en: "New declaration",
                      etat: 3,
                    });
                  });
                  notification.bulkCreate(arrayNotif).then(() => {});
                  return res.status(200).send(true);
                });
              });
          })
          .catch((error) => {
            console.log(error);
            return res.status(403).send(error);
          });
      })
      .catch((error) => {
        return res.status(403).send(error);
      });
  }
});

router.get("/getDeclarations/:id_role/:id", auth, async (req, res) => {
  var id_role = req.params.id_role;
  var id = req.params.id;
  var where = id_role == 2 ? { id: id } : {};
  var rapportUser = await rapport.findAll({
    where: { id_passager: null },
    include: [
      "medicaments",
      "voix_administrations",
      {
        model: user,
        as: "users",
        where: where,
        include: ["specialites"],
      },
      {
        model: patient,
        as: "patients",
        include: ["ages", "indications"],
      },
    ],
  });

  var merged_arr = rapportUser;
  if (id_role != 2) {
    var rapportPassager = await rapport.findAll({
      where: { id_user: null },
      include: [
        "medicaments",
        "voix_administrations",
        {
          model: passager,
          as: "passagers",
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
    });
    merged_arr = rapportUser.concat(rapportPassager);
  }
  return res.status(200).send(merged_arr);
  /* rapport
    .findAll({
      include: [
        "medicaments",
        "effet_indesirables",
        "voix_administrations",
        {
          model: user,
          as: "users",
          where: where,
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
    }); */
});

router.get("/getDeclarationsById/:id", auth, (req, res) => {
  var id = req.params.id;
  rapport
    .findOne({
      where: { id: id },
      include: [
        "medicaments",
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

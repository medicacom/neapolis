const express = require("express");
const router = express.Router();
var role = require("../models/role");
var user = require("../models/user");
var news = require("../models/news");
var indication = require("../models/indication");
var voix_administration = require("../models/voix_administration");
var effet_indesirable = require("../models/effet_indesirable");
var medicaments = require("../models/medicament");
var patient = require("../models/patient");
var rapport = require("../models/rapport");
var notification = require("../models/notification");

var bcrypt = require("bcrypt");
const sendMail = require("./sendMailController");
module.exports = router;
/****
 * type_table
 * 1-root
 * 2-role
 * 3-users
 * 4-news
 * 5-voix
 * 6-indications
 * 7-effet
 * 8-declaration
 * 10-notifiacation
 ****/

router.post("/updateBDOld/:idUser", async (req, res) => {
  var insertRole = req.body.insertRole;
  var final = req.body.final;
  var insertUser = [];
  var objRole = new Object();
  if (insertRole.length !== 0) {
    var rolesCreate = await role.bulkCreate(insertRole);
    for (const key in rolesCreate) {
      const element = rolesCreate[key];
      objRole[element.nom] = element.id;
    }
  }
  for (const key1 in final) {
    var element1 = final[key1];
    if (element1.type_table == 2) {
      var id = element1.id;
      var nom = element1.nom;
      var roles = element1.role;
      var order = element1.order;
      var roleFind = await role.findOne({ where: { id: id } });
      if (roleFind) {
        await role.update(
          {
            order: order,
            role: roles,
            nom: nom,
          },
          { where: { id: id } }
        );
      }
    } else if (element1.type_table == 3) {
      var id = element1.id;
      var nom = element1.nom;
      var prenom = element1.prenom;
      var login = element1.login;
      var email = element1.email;
      /* var id_role = element1.id_role; */
      var nom_role = element1.nom_role;
      var id_role = element1.id_role;
      if (Object.keys(objRole).length != 0) {
        id_role = objRole[nom_role] ? objRole[nom_role] : id_role;
      }
      var tel = element1.tel;
      var password = element1.password;
      if (element1.saved == 0) {
        const salt = bcrypt.genSaltSync();
        mdp = bcrypt.hashSync(password, salt);
        insertUser.push({
          nom: nom,
          prenom: prenom,
          login: login,
          email: email,
          id_role: id_role,
          tel: tel,
          etat: 1,
          password: mdp,
        });
      } else if (element1.updated == 1) {
        var userFind = await user.findOne({ where: { id: id } });
        if (userFind) {
          var mdp = "";
          if (password == "") {
            mdp = userFind.dataValues.password;
          } else {
            const salt = bcrypt.genSaltSync();
            mdp = bcrypt.hashSync(password, salt);
          }
          await user.update(
            {
              nom: nom,
              prenom: prenom,
              login: login,
              email: email,
              id_role: id_role,
              tel: tel,
              etat: 1,
              password: mdp,
            },
            { where: { id: id } }
          );
        }
      }
    }
  }
  if (insertUser.length !== 0) user.bulkCreate(insertUser).then(() => {});

  return res.status(200).json(final);
});

router.post("/updateBD/:idUser", async (req, res) => {
  var newsStore = req.body.newsStore;
  var roleStore = req.body.roleStore;
  var userStore = req.body.userStore;
  var indicationsStore = req.body.indicationsStore;
  var voixStore = req.body.voixStore;
  var effStore = req.body.effStore;
  var medicamentStore = req.body.medicamentStore; 
  var declaStore = req.body.declaStore; 

  if(declaStore.length !== 0) {
    for (const key in declaStore) { 
      const element1 = declaStore[key];
      patient
        .create({
          id_user: element1.patients.id_user,
          initiales: element1.patients.initiales,
          age: element1.patients.age,
          sexe: element1.patients.sexe,
          dateNaissance: element1.patients.dateNaissance,
          agePatient: element1.patients.agePatient,
          ageCategorie: element1.patients.ageCategorie != 0 ? element1.patients.ageCategorie : null,
          id_indication: element1.patients.id_indication,
          poid: element1.patients.poid,
          taille: element1.patients.taille,
          allergie: element1.patients.allergie,
        })
        .then((p) => {
          rapport
            .create({
              id_user: element1.id_user,
              id_patient: p.id,
              effet: element1.effet,
              dateDebut: element1.dateDebut,
              dateFin: element1.dateFin,
              information: element1.information,
              complementaires: element1.complementaires,
              id_medicament: element1.id_medicament,
              dateDebutAdmin: element1.dateDebutAdmin,
              dateFinAdmin: element1.dateFinAdmin,
              id_voix: element1.id_voix,
              posologie: element1.posologie,
              numero: element1.numero,
              grave: element1.grave,
              hospitalisation: element1.hospitalisation,
              pronostic: element1.pronostic,
              incapacite: element1.incapacite,
              anomalie: element1.anomalie,
              autre: element1.autre,
              evolution: element1.evolution,
              traites: element1.traites,
              survenus: element1.survenus,
              deces: element1.deces,
              date_admin: element1.date_admin,
              therapeutique: element1.therapeutique,
              description_eff: element1.description_eff,
              poid: element1.poid,
              taille: element1.taille,
              allergie: element1.allergie,
            })
            .then((r) => {
              user.findAll({ where: { id_role: [1, 3] } }).then(function (u) {
                var msg = "";
                var txt =
                  element1.lang == "fr"
                    ? "Neapolis | Nouvelle déclaration"
                    : element1.lang == "en"
                    ? "Neapolis | New declaration"
                    : "Neapolis | بيان جديد";
                msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
                var subject =
                  element1.lang == "fr"
                    ? "Sujet: " + txt
                    : element1.lang == "en"
                    ? "Subject: " + txt
                    : txt + ` :موضوع`;
                var arrayNotif = [];
                u.forEach((element) => {
                  var hi =
                    element1.lang == "fr"
                      ? `Bonjour ${
                          element.dataValues.nom +
                          " " +
                          element.dataValues.prenom
                        } ,`
                      : element1.lang == "en"
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
                  sendMail(subject, msg, element.dataValues.email, hi, [], element1.lang);
                  arrayNotif.push({
                    id_user: element.dataValues.id,
                    text: "Nouvelle déclaration",
                    text_ar: "بيان جديد",
                    text_en: "New declaration",
                    etat: 3,
                  });
                });
                notification.bulkCreate(arrayNotif).then(() => {});
              });
            });
        })
    }
  }
  var objRole = new Object();
  if (roleStore.length !== 0) {
    var rolesCreate = await role.bulkCreate(roleStore);
    for (const key in rolesCreate) {
      const element = rolesCreate[key];
      objRole[element.nom] = element.id;
    }
  }

  if (newsStore.length !== 0) {
    await news.bulkCreate(newsStore);
  }

  if (voixStore.length !== 0) {
    await voix_administration.bulkCreate(voixStore);
  }

  if (indicationsStore.length !== 0) {
    await indication.bulkCreate(indicationsStore);
  }

  if (effStore.length !== 0) {
    await effet_indesirable.bulkCreate(effStore);
  }

  if (medicamentStore.length !== 0) {
    await medicaments.bulkCreate(medicamentStore);
  }

  if (userStore.length !== 0) {
    var insertUser = [];
    for (const key in userStore) {
      const element1 = userStore[key];
      var nom = element1.nom;
      var prenom = element1.prenom;
      var login = element1.login;
      var email = element1.email;
      /* var id_role = element1.id_role; */
      var nom_role = element1.nom_role;
      var id_role = element1.id_role;
      if (Object.keys(objRole).length != 0) {
        id_role = objRole[nom_role] ? objRole[nom_role] : id_role;
      }
      var tel = element1.tel;
      var password = element1.password;
      const salt = bcrypt.genSaltSync();
      mdp = bcrypt.hashSync(password, salt);
      insertUser.push({
        nom: nom,
        prenom: prenom,
        login: login,
        email: email,
        id_role: id_role,
        tel: tel,
        etat: 1,
        password: mdp,
      });
    }
    await user.bulkCreate(insertUser);
  }

  return res.status(200).json({
    msg:true
  }); 

})

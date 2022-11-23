const express = require("express");
const router = express.Router();
var role = require("../models/role");
var user = require("../models/user");
var news = require("../models/news");
var indication = require("../models/indication");
var voix_administration = require("../models/voix_administration");
var effet_indesirable = require("../models/effet_indesirable");
var medicaments = require("../models/medicament");

var bcrypt = require("bcrypt");
const webpush = require("web-push");
var fs = require("fs");
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
 ****/
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:feriani.khalil2@gmail.com",
  publicVapidKey,
  privateVapidKey
);
// Subscribe Route
router.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  console.log(subscription);
  // Send 201 - resource created
  res.status(201).json({});
  /* const data = fs.readFileSync('../client/src/assets/img/logo.png');
  console.log("first",data) */
  // Create payload
  const payload = JSON.stringify({
    title: "Push Test",
    body: {
      body: "Notified by khalil1",      
      icon: "/logo.png",
      /* icon: "http://image.ibb.co/frYOFd/tmlogo.png", */
    },
  });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
});


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

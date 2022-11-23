const express = require("express");
const router = express.Router();
var specialites = require("../models/specialite");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addSpecialite",auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    specialites
      .create({
        nom: req.body.nom,
        etat: 1,
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    specialites.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        specialites
          .update({
            nom: req.body.nom,
            etat: 1,
          },{ where: { id: id } })
          .then((r2) => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allSpecialite", (req, res) => {
  specialites.findAll().then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteSpecialite/:id",auth, (req, res) => {
  var id = req.params.id;
  specialites.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      specialites.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getSpecialite",auth, (req, res) => {
  var id = req.headers["id"];
  specialites.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});
router.put("/changerEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  //var etat = req.body.etat;
  specialites.findOne({ where: { id: id } }).then(function (r1) {
    //console.log(!r1.dataValues.etat)
    var etat = 0;
    if (r1.dataValues.etat == 0) etat = 1;
    if (!r1) {
      return res.status(403).send(false);
    } else {
      specialites
        .update(
          {
            etat: etat,
          },
          { where: { id: id } }
        )
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/getActive", auth, (req, res) => {
  specialites
    .findAll({
      where:{etat:1}
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

module.exports = router;

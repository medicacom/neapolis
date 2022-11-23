const express = require("express");
const router = express.Router();
var medicament = require("../models/medicament");
const auth = require("../middlewares/passport");
const webpush = require("web-push");

// Desplay all lignes of client ...
router.post("/addMedicament", auth, (req, res) => {
  var id = req.body.id;
  var nom = req.body.nom;
  var form = req.body.form;
  var dosage = req.body.dosage;
  var id_indication = req.body.id_indication;
  var id_voix = req.body.id_voix;
  if (id == 0) {
    medicament
      .create({
        nom: nom,
        form: form,
        dosage: dosage,
        id_voix: id_voix,
        id_indication: id_indication,
        etat:1
      })
      .then((r) => {
        return res.status(200).send({ data: r, msg: true });
      })
      .catch((error) => {
        return res.status(403).send({ error: error, msg: false });
      });
  } else {
    medicament.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        medicament
          .update(
            {
              nom: nom,
              form: form,
              dosage: dosage,
              id_voix: id_voix,
              id_indication: id_indication,
              etat:1
            },
            { where: { id: id } }
          )
          .then((r) => {
            return res.status(200).send({ data: r, msg: true });
          })
          .catch((error) => {
            return res.status(403).send({ error: error, msg: false });
          });
      }
    });
  }
});
router.post("/allMedicament", auth, (req, res) => {
  medicament
    .findAll({
      order: ["id"],
      include: ["voix_administrations", "indications"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

//Delete client
router.delete("/deleteMedicament/:id", auth, (req, res) => {
  var id = req.params.id;
  medicament.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      medicament
        .destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getMedicament", auth, (req, res) => {
  var id = req.headers["id"];
  medicament
    .findOne({
      where: { id: id },
      include: ["voix_administrations", "indications"],
    })
    .then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        return res.status(200).json(r1.dataValues);
      }
    });
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  medicament.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      medicament
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
module.exports = router;

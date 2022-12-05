const express = require("express");
const router = express.Router();
var age = require("../models/age");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
// Desplay all lignes of client ...
router.post("/addAge", auth, (req, res) => {
  var id = req.body.id;
  var description = req.body.description;
  var description_en = req.body.description_en;
  var description_ar = req.body.description_ar;
  if (id == 0) {
    age
      .create({
        description: description,
        description_en: description_en,
        description_ar: description_ar,
        etat: 1,
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    age.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        age
          .update(
            {
              description: description,
              description_en: description_en,
              description_ar: description_ar,
              etat: 1,
            },
            { where: { id: id } }
          )
          .then(() => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allAge", (req, res) => {
  age.findAll({ order: ["id"] }).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteAge/:id", auth, (req, res) => {
  var id = req.params.id;
  age.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      age
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
router.post("/getAge", auth, (req, res) => {
  var id = req.headers["id"];
  age.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

module.exports = router;

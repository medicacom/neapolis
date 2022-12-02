const express = require("express");
const router = express.Router();
var effet_indesirable = require("../models/effet_indesirable");
const auth = require("../middlewares/passport");
// Desplay all lignes of client ...
router.post("/addEffet_indesirable", auth, (req, res) => {
  var id = req.body.id;
  var description = req.body.description;
  var description_en = req.body.description_en;
  var description_ar = req.body.description_ar;
  if (id == 0) {
    effet_indesirable
      .create({
        description: description,
        description_en: description_en,
        description_ar: description_ar
      })
      .then((r) => {
        return res.status(200).send({data:r,msg:true});
      })
      .catch((error) => {
        return res.status(403).send({error:error,msg:false});
      });
  } else {
    effet_indesirable.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        effet_indesirable
          .update({
            description: description,
            description_en: description_en,
            description_ar: description_ar
          },{ where: { id: id } })
          .then((r) => {
            return res.status(200).send({data:r,msg:true});
          })
          .catch((error) => {
            return res.status(403).send({error:error,msg:false});
          });
      }
    });
  }
});

router.post("/getActive", (req, res) => {
  effet_indesirable
    .findAll({
      where: { etat: 1 },
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.post("/allEffet_indesirable",auth, (req, res) => {
  effet_indesirable.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteEffet_indesirable/:id", auth, (req, res) => {
  var id = req.params.id;
  effet_indesirable.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      effet_indesirable.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/getEffet_indesirable",auth, (req, res) => {
  var id = req.headers["id"];
  effet_indesirable.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  effet_indesirable.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      effet_indesirable
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

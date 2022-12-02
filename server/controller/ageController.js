const express = require("express");
const router = express.Router();
var age = require("../models/age");
var tests = require("../models/test");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize"); 
// Desplay all lignes of client ...
router.post("/addAge", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    age
      .create({
        description: req.body.description,
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
          .update({
            description: req.body.description,
          },{ where: { id: id } })
          .then((r2) => {
            if(req.body.selected === 1)
              age
                .update({
                  selected:0,
                },{ where: { id: {[Op.ne]:req.body.id} } })
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allAge",(req, res) => {
  age.findAll({order:["id"]}).then(function (r) {
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
      age.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getAge",auth, (req, res) => {
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

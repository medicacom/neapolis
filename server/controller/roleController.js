const express = require("express");
const router = express.Router();
var role = require("../models/role");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addRole", auth, (req, res) => {
  var id = req.body.id;
  var nom = req.body.nom;
  var roles = req.body.role;
  var order = req.body.order;
  if (id == 0) {
    role
      .create({
        nom: nom,
        role: roles,
        order: order,
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    role.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        role
          .update({
            nom: req.body.nom,
            role: roles,
            order: order,
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

router.post("/allRole",auth, (req, res) => {
  role.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteRole/:id", auth, (req, res) => {
  var id = req.params.id;
  role.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      role.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getRole",auth, (req, res) => {
  var id = req.headers["id"];
  role.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});
router.put("/updateRoles", auth, async(req, res) => {
  var updateRole = req.body.updateRole;
  try {
    for (const key in updateRole) {
      const element = updateRole[key];
      var id = element.id;
      var nom = element.nom;
      var order = element.order;
      role.update(
        {
          nom: nom,
          order: order,
        },
        { where: { id: id } }
      );
      return res.status(200).send(true);
    }
  } catch (error) {
    console.log(error)
    return res.status(403).send(error);    
  }
})
module.exports = router;

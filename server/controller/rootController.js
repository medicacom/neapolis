const express = require("express");
const router = express.Router();
var root = require("../models/root");
const { Op } = require("sequelize");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addRoot", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    root
      .create({
        name: req.body.name,
        name_en: req.body.nameEn,
        name_ar: req.body.nameAr,
        path: req.body.path,
        component: req.body.component,
        icon: req.body.icon,
        role: req.body.role,
        parent: req.body.parent,
        ordre: req.body.ordre,
        className: req.body.className
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    root.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        root
          .update(
            {
              name: req.body.name,
              name_en: req.body.nameEn,
              name_ar: req.body.nameAr,
              path: req.body.path,
              component: req.body.component,
              icon: req.body.icon,
              role: req.body.role,
              parent: req.body.parent,
              ordre: req.body.ordre,
              className: req.body.className
            },
            { where: { id: id } }
          )
          .then((r2) => {
            return res.status(200).send(r2);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});

router.post("/allRoot", auth, (req, res) => {
  root.findAll().then(function (r) {
    return res.status(200).send(r);
  });
});

router.get("/getRoot/:id", auth, (req, res) => {
  var id = req.params.id;
  root.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});


router.delete("/deleteRoot/:id", auth, (req, res) => {
  var id = req.params.id;
  root.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      root
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

router.get("/getRootByRole/:role", auth, async (req, res) => {
  var idRole = req.params.role; 
  var getRootPere = await root.findAll({
    where: {
      parent: 0,      
      [Op.or]: [{ role: { [Op.like]: "%" + idRole + "%" } }, { role: 0 }, { role: 20 }],
      /* role: { [Op.like]: "%" + idRole + "%" }, */
    },
    order: [["ordre", "asc"]],
  });
  var arrayRoots = [];
  for (const key in getRootPere) {
    var getRootFils = await root.findAll({
      where: {
        parent: getRootPere[key].dataValues.id,
      },
      order: [["ordre", "asc"]],
    });
    var roles=getRootPere[key].dataValues.role;
    var splitRole = roles.split(",");
    var arrayRole=[];
    splitRole.forEach(elemnt=>{
      arrayRole.push(parseInt(elemnt));
    })
    if (getRootFils.length == 0) {
      //
      var p =getRootPere[key].dataValues.name != "404 not found"? "/"+ getRootPere[key].dataValues.path : "*";
      arrayRoots.push({
        path: p,
        name: getRootPere[key].dataValues.name,
        name_en: getRootPere[key].dataValues.name_en,
        name_ar: getRootPere[key].dataValues.name_ar,
        icon: getRootPere[key].dataValues.icon,
        role: arrayRole,
        componentStr: getRootPere[key].dataValues.component,
        className: getRootPere[key].dataValues.className,
        type: getRootPere[key].dataValues.type
      });
    } else {
      var arrayView = [];
      getRootFils.forEach((e) => {
        var rolesFils=e.dataValues.role;
        var splitRoleFils = rolesFils.split(",");
        var arrayRoleFils=[];
        splitRoleFils.forEach(elemnt=>{
          arrayRoleFils.push(parseInt(elemnt));
        })
        arrayView.push({
          path: "/"+e.dataValues.path,
          name: e.dataValues.name,
          name_en: e.dataValues.name_en,
          name_ar: e.dataValues.name_ar,
          icon: e.dataValues.icon,
          role: arrayRoleFils,
          componentStr: e.dataValues.component,
          type: e.dataValues.type,
        });
      });
      arrayRoots.push({
        collapse: true,
        path: "/"+getRootPere[key].dataValues.path,
        name: getRootPere[key].dataValues.name,
        name_en: getRootPere[key].dataValues.name_en,
        name_ar: getRootPere[key].dataValues.name_ar,
        state: "pere"+key,
        icon: getRootPere[key].dataValues.icon,
        type: getRootPere[key].dataValues.type,
        role: arrayRole,
        views:arrayView
      })
    }
  }
  return res.status(200).send(arrayRoots);
});

module.exports = router;

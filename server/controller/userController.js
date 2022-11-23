const express = require("express");
const router = express.Router();
var user = require("../models/user");
const jwt = require("jsonwebtoken");
const privateKey = "mySecretKeyabs";
const multer = require("multer");
var bcrypt = require("bcrypt");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
const sendMail = require("./sendMailController");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/signature");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/saveSignature", auth, upload.single("signature"), (req, res) => {
  if (typeof req.file != "undefined") res.send({ filename: req.file.filename });
  else res.send({ filename: "" });
});

router.post("/updateProfile", auth, (req, res) => {
  var id = req.body.id;
  user.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      var password = "";
      if (req.body.password == "") {
        password = r1.password;
      } else {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(req.body.password, salt);
      }
      user
        .update(
          {
            nom: req.body.nom,
            prenom: req.body.prenom,
            login: req.body.login,
            tel: req.body.tel,
            password: password,
            etat: 1,
          },
          { where: { id: id } }
        )
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/addUser", (req, res) => {
  var id = req.body.id;
  var nom = req.body.nom;
  var prenom = req.body.prenom;
  var email = req.body.email;
  var tel = req.body.tel;
  var role = req.body.role;
  var password = req.body.password;
  var login = req.body.login;
  var id_sp = req.body.id_sp;
  var id_gouvernorat = req.body.id_gouvernorat;
  var valide = req.body.valide;
  console.log("addUser",req.body)
  if (id == 0) {
    user
      .create({
        prenom: prenom,
        nom: nom,
        login: login,
        email: email,
        tel: tel,
        id_role: role,
        password: password,
        id_gouvernorat:id_gouvernorat,
        id_sp:id_sp,
        etat: 1,
        valider:valide
      })
      .then((u) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(error);
      });
  } else {
    user.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(400).send(false);
      } else {
        var password = "";
        if (req.body.password == "") {
          password = r1.password;
        } else {
          const salt = bcrypt.genSaltSync();
          password = bcrypt.hashSync(req.body.password, salt);
        }
        user
          .update(
            {
              prenom: prenom,
              nom: nom,
              login: login,
              email: email,
              tel: tel,
              id_role: role,
              password: password,
              id_gouvernorat:id_gouvernorat,
              id_sp:id_sp,
              etat: 1,
            },
            { where: { id: id } }
          )
          .then((u) => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            console.log(error)
            return res.status(400).send(error);
          });
      }
    });
  }
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  user.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      user
        .update(
          {
            etat: etat,
          },
          { where: { id: id } }
        )
        .then((r2) => {
          /* var msg = "";
          msg += ` <tr><td style="padding-top:5px;"> Sujet :jjjjjjj </td></tr>`;
          sendMail("Nouvelle formation",msg,"feriani.khalil2@gmail.com","feriani khalil2");  */
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.put("/validation/:id", auth, (req, res) => {
  console.log(req.body)
  var id = req.params.id;
  var valider = req.body.valider;
  var email = req.body.email;
  var nom = req.body.nom;
  user.findOne({ where: { id: id } }).then(function (u) {
    if (!u) {
      return res.status(403).send(false);
    } else {
      user
        .update(
          {
            valider: valider,
          },
          { where: { id: id } }
        )
        .then((r2) => {
          var msg = "";
          var txt = valider == 1?"Sujet :Valider d'inscription":"Sujet : Refuser d'inscription"
          msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
          sendMail("Inscription",msg,email,nom); 
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/allUser", auth, (req, res) => {
  user
    .findAll({
      include: ["roles"],
      order: [["id", "desc"]],
      where:{id_role:{ [Op.ne]: 2 }}
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.get("/getPersonnel", auth, (req, res) => {
  user
    .findAll({
      include: ["roles"],
      order: [["id", "desc"]],
      where:{ id_role: 2 }
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.post("/getActive", auth, (req, res) => {
  user
    .findAll({
      where: { etat: 1 },
      include: ["roles"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.delete("/deleteUser/:id", auth, (req, res) => {
  var id = req.params.id;
  user.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      user
        .destroy({ where: { id: id } })
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/getUser", auth, (req, res) => {
  var id = req.headers["id"];
  user.findOne({ where: { id: id },include:["roles","gouvernorats","specialites"] }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json({user:u1.dataValues})
      /* return res.status(200).json(u1.dataValues); */
    }
  });
});

router.post("/login", (req, res) => {
  var login = req.body.login;
  var password = req.body.password;
  user
    .findOne({
      include: ["roles"],
      where: { login: login, etat: 1 },
    })
    .then(function (u1) {
      if (!u1) {
        /* return res.status(403).send(false); */
        res.status(401).send({ message: "Utilisateur n'est pas Existe" });
      } else if (!u1.validPassword(password)) {
        res
          .status(401)
          .send({ message: "Verfier votre Login et Mot de passe!" });
        /* return res.status(403).send(false); */
      } else {
        var code = Math.floor(Math.random() * 1000) + 1000;
        const payload = {
          //login: newdata.login,
          id: u1.dataValues.id,
          random: code,
        };
        const token = jwt.sign(payload, privateKey, {});
        user
          .update(
            {
              token: token,
              code: code,
            },
            { where: { id: u1.dataValues.id } }
          )
          .then((u2) => {
            return res
              .status(200)
              .send({ data: u1.dataValues, token: token, message: true });
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    })
    .catch((error) => {
      return res.status(500).send(false);
    });
});

router.get("/getDetailUser/:id", auth, async (req, res) => {
  var id = req.params.id;
  try {
    var findUser = await user.findOne({
      include: ["roles"],
      where: { id: id },
    });
    return res.status(200).send({
      data: {
        user: findUser ? findUser.dataValues : null,
      },
      message: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error });
  }
});

router.get("/verification", auth, (req, res) => {
  var token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, privateKey);
  user
    .findOne({ where: { token: token, id: decoded.id, code: decoded.random } })
    .then((e) => {
      if (e) {
        return res.status(200).send(e);
      } else {
        user.update(
          {
            token: null,
          },
          { where: { id: decoded.id } }
        );
        return res.status(200).send(false);
      }
    });
});

module.exports = router;

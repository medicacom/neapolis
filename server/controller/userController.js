const express = require("express");
const router = express.Router();
var user = require("../models/user");
var notification = require("../models/notification");
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
  var id_sp = req.body.id_sp;
  var id_gouvernorat = req.body.id_gouvernorat;
  var valide = req.body.valide;
  var autre_sp = req.body.autre_sp;
  var lang = req.body.lang;
  user
    .findOne({ where: { email: email, id: { [Op.ne]: id } } })
    .then(function (u1) {
      if (!u1 || u1.email != email) {
        if (id == 0) {
          user
            .create({
              prenom: prenom,
              nom: nom,
              email: email,
              tel: tel,
              id_role: role,
              password: password,
              id_gouvernorat: id_gouvernorat,
              id_sp: id_sp,
              etat: 1,
              valider: valide,
              autre_sp: autre_sp,
            })
            .then((u) => {
              if (valide == 0) {
                var arrayNotif = [];
                user.findAll({ where: { id_role: 1 } }).then((u) => {
                  var msg1 =
                    lang == "fr"
                      ? "Sujet: une nouvelle inscription"
                      : lang == "en"
                      ? "Subject: new registration"
                      : "الموضوع: تسجيل جديد";
                  var msg2 =
                    lang == "fr"
                      ? `Nom: ${nom}`
                      : lang == "en"
                      ? `Name: ${nom}`
                      : `${nom} :الاسم`;
                  var msg3 =
                    lang == "fr"
                      ? `Prenom: ${prenom}`
                      : lang == "en"
                      ? `Last name: ${prenom}`
                      : `${prenom} :اللقب`;
                  var msg4 =
                    lang == "fr"
                      ? `E-mail: ${email}`
                      : lang == "en"
                      ? `E-mail: ${email}`
                      : `${email} :البريد الإلكتروني`;
                  var msg = ` <tr><td style="padding-top:5px;"> ${msg1} </td></tr>`;
                  msg += ` <tr><td style="padding-top:5px;"> ${msg2} </td></tr>`;
                  msg += ` <tr><td style="padding-top:5px;"> ${msg3} </td></tr>`;
                  msg += ` <tr><td style="padding-top:5px;"> ${msg4} </td></tr>`;
                  u.forEach((element) => {
                    var hi =
                      lang == "fr"
                        ? `Bonjour ${
                            element.dataValues.nom +
                            " " +
                            element.dataValues.prenom
                          } ,`
                        : lang == "en"
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
                    var subject =
                      lang == "fr"
                        ? "Sujet: une nouvelle inscription"
                        : lang == "en"
                        ? "New registration"
                        : "تسجيل جديد";
                    sendMail(
                      subject,
                      msg,
                      element.dataValues.email,
                      hi,
                      [],
                      lang
                    );
                    arrayNotif.push({
                      id_user: element.dataValues.id,
                      text: "Inscription",
                      text_ar: "تسجيل",
                      text_en: "Registration",
                      etat: 1,
                    });
                  });
                  notification.bulkCreate(arrayNotif).then(() => {});
                });
              }
              return res.status(200).send({ error: [], data: u, msg: 1 });
            })
            .catch((error) => {
              return res.status(400).send({ error: error, data: [], msg: 2 });
            });
        } else {
          user.findOne({ where: { id: id } }).then(function (r1) {
            if (!r1) {
              return res.status(400).send({ error: error, data: [], msg: 2 });
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
                    email: email,
                    tel: tel,
                    id_role: role,
                    password: password,
                    id_gouvernorat: id_gouvernorat,
                    id_sp: id_sp,
                    etat: 1,
                    autre_sp: autre_sp,
                  },
                  { where: { id: id } }
                )
                .then(() => {
                  return res.status(200).send({ error: [], data: r1, msg: 1 });
                })
                .catch((error) => {
                  console.log(error);
                  return res
                    .status(400)
                    .send({ error: error, data: [], msg: 2 });
                });
            }
          });
        }
      } else {
        return res.status(403).send({ error: [], data: [], msg: 3 });
      }
    });
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
        .then(() => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.put("/validation/:id", auth, (req, res) => {
  var id = req.params.id;
  var valider = req.body.valider;
  var email = req.body.email;
  var nom = req.body.nom;
  var lang = req.body.lang;
  var hi =
    lang == "fr"
      ? `Bonjour ${nom} ,`
      : lang == "en"
      ? `Hello ${nom} ,`
      : ` ${nom} مرحبا`;
  var msg = "";
  var txt = "";
  if (lang == "fr") {
    txt =
      valider == 1
        ? "Objet : Validation de l'inscription au platform I-declare"
        : "Objet : Inscription au platform I-declare est refusée";
  } else if (lang == "en") {
    txt =
      valider == 1
        ? "Subject: Validation of registration on the I-declare platform"
        : "Subject: Registration to the I-declare platform is refused";
  } else if (lang == "ar") {
    txt =
      valider == 1
        ? `I-DECLARE الموضوع: تم قبول التسجيل في منصة`
        : `I-DECLARE الموضوع: تم رفض التسجيل في منصة`;
  }
  msg += ` <tr><td style="padding-top:5px;"> ${txt} </td></tr>`;
  var subject =
    lang == "fr" ? "Inscription" : lang == "en" ? "Registration" : "التسجيل";
  user.findOne({ where: { id: id } }).then(function (u) {
    if (!u) {
      return res.status(403).send(false);
    } else {
      if (valider == 1) {
        user
          .update(
            {
              valider: valider,
            },
            { where: { id: id } }
          )
          .then(() => {
            sendMail(subject, msg, email, hi, [], lang);
            return res.status(200).send(true);
          })
          .catch(() => {
            return res.status(403).send(false);
          });
      } else {
        user
          .destroy({ where: { id: id } })
          .then(() => {
            sendMail(subject, msg, email, hi, [], lang);
            return res.status(200).send(true);
          })
          .catch(() => {
            return res.status(403).send(false);
          });
      }
    }
  });
});

router.post("/allUser", auth, (req, res) => {
  user
    .findAll({
      include: ["roles", "gouvernorats", "specialites"],
      order: [["id", "desc"]],
      where: { id_role: { [Op.ne]: 2 } },
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.get("/getPersonnel", auth, async (req, res) => {
  var findValider = await user.findAll({
    include: ["roles", "gouvernorats", "specialites"],
    order: [["id", "desc"]],
    where: { id_role: 2, valider: 1 },
  });
  var findNonValider = await user.findAll({
    include: ["roles", "gouvernorats", "specialites"],
    order: [["id", "desc"]],
    where: { id_role: 2, valider: 0 },
  });
  return res.status(200).send({ findValider, findNonValider });
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
  user
    .findOne({
      where: { id: id },
      include: ["roles", "gouvernorats", "specialites"],
    })
    .then(function (u1) {
      if (!u1) {
        return res.status(403).send(false);
      } else {
        return res.status(200).json({ user: u1.dataValues });
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
      where: { email: login, etat: 1, valider: 1 },
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

router.post("/verificationEmail", (req, res) => {
  var email = req.body.email;
  user.findOne({ where: { email: email } }).then((e) => {
    if (e) {
      return res.status(200).send(true);
    } else {
      return res.status(200).send(false);
    }
  });
});

module.exports = router;

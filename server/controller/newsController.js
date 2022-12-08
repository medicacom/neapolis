const express = require("express");
const router = express.Router();
var news = require("../models/news");
var news_user = require("../models/news_user");
const auth = require("../middlewares/passport");
const multer = require("multer");
const webpush = require("web-push");
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";
resolve = require("path").resolve;
var configuration = require("../config");
const user = require("../models/user");
var config = configuration.connection;
var Sequelize = require("sequelize");
const sendMail = require("./sendMailController");
var fs = require("fs");
const sequelize = new Sequelize(config.base, config.root, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  operatorsAliases: false,
});

/* webpush.setVapidDetails(
  "mailto:feriani.khalil2@gmail.com;dragonxi12341@gmail.com",
  publicVapidKey,
  privateVapidKey
); */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./new");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });
// Desplay all lignes of client ...
router.post("/saveFile", auth, upload.single("file"), (req, res) => {
  var filename = "";
  try {
    if (typeof req.file != "undefined") filename = req.file.filename;
    res.send({ filename: filename });
    
  } catch (error) {
    console.log(error)
    
  }
});
router.post("/addNews", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    news
      .create({
        titre: req.body.titre,
        description: req.body.description,
        date: req.body.date,
        file: req.body.filename,
      })
      .then((r) => {
        var arrayInsert = [];
        req.body.userSelect.forEach((element) => {
          msg = ` <tr><td style="padding-top:5px;"> Sujet: Incription </td></tr>`;
          sendMail("Nouveauté", msg, element.email, element.label);
          arrayInsert.push({
            id_news: r.dataValues.id,
            id_user: element.value,
          });
        });
        news_user.bulkCreate(arrayInsert).then(() => {
          return res.status(200).send({ data: r, msg: true });
        });
      })
      .catch((error) => {
        console.log("first", error);
        return res.status(403).send({ error: error, msg: false });
      });
  } else {
    news.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        news
          .update(
            {
              titre: req.body.titre,
              description: req.body.description,
              date: req.body.date,
              file: req.body.filename,
            },
            { where: { id: id } }
          )
          .then(() => {
            var arrayInsert = [];
            req.body.userSelect.forEach((element) => {
              msg = ` <tr><td style="padding-top:5px;"> Sujet: Incription </td></tr>`;
              sendMail("Nouveauté", msg, element.email, element.label);
              arrayInsert.push({
                id_news: id,
                id_user: element.value,
              });
            });
            news_user.bulkCreate(arrayInsert).then(() => {
              return res.status(200).send({ data: r1, msg: true });
            });
          })
          .catch((error) => {
            console.log(error);
            return res.status(403).send({ error: error, msg: false });
          });
      }
    });
  }
});
router.post("/allNews", auth, (req, res) => {
  news.findAll({ order: ["id"] }).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteNews/:id", auth, (req, res) => {
  var id = req.params.id;
  news.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      news
        .destroy({ where: { id: id } })
        .then(() => {
          var file = r1.dataValues.file;
          if (fs.existsSync("./new/" + file)) fs.unlinkSync("./new/" + file);
          return res.status(200).send(true);
        })
        .catch((error) => {
          console.log(error)
          return res.status(403).send(error);
        });
    }
  });
});
router.get("/getFile/:id", async (req, res) => {
  var id = req.params.id;
  var newsFind = await news.findOne({ where: { id: id } });
  try {
    if (newsFind != null) {
      var file = newsFind.dataValues.file; 
      if (file) {
        if (fs.existsSync("./new/" + file)) {
          console.log(file)
          var file = fs.createReadStream("./new/" + file);
          file.pipe(res);
        } else return res.status(403).json({ message: false });
      } else {
        return res.status(403).json({ message: false });
      }
    }
    
  } catch (error) {
    console.log(error)
  } 
});
router.post("/getNews", auth, (req, res) => {
  var id = req.headers["id"];
  news.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  news.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      news
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

// Subscribe Route
router.post("/subscribe/:id", async (req, res) => {
  // Get pushSubscription object
  var id = req.params.id;
  const subscription = req.body;
  var findNews = await news.findOne({ where: { id: id } });
  // Send 201 - resource created
  res.status(201).json({});
  news_user
    .findOne({
      where: { id_news: id },
      include: [
        {
          model: user,
          as: "users",
          attributes: [
            [
              sequelize.fn("GROUP_CONCAT", sequelize.col("users.email")),
              "emailU",
            ],
          ],
        },
      ],
    })
    .then((val) => {
      var email = val.dataValues.users.dataValues.emailU.replaceAll(",", ";");
      // Create payload
      const payload = JSON.stringify({
        title: findNews.dataValues.titre,
        body: {
          body: findNews.dataValues.description,
          icon: config.path + findNews.dataValues.file,
          /* icon: "http://image.ibb.co/frYOFd/tmlogo.png", */
        },
      });
      // Pass object into sendNotification
      webpush.setVapidDetails(
        "mailto:" + email,
        publicVapidKey,
        privateVapidKey
      );
      webpush
        .sendNotification(subscription, payload)
        .catch((err) => console.error(err));
    });
});
module.exports = router;

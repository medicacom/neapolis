const express = require("express");
const router = express.Router();
var effet_indesirable = require("../models/effet_indesirable");
const auth = require("../middlewares/passport");
const webpush = require("web-push");
const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:feriani.khalil2@gmail.com",
  publicVapidKey,
  privateVapidKey
);
// Desplay all lignes of client ...
router.post("/addEffet_indesirable", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    effet_indesirable
      .create({
        description: req.body.description,
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
            description: req.body.description,
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

// Subscribe Route
router.post("/subscribe/:id", async(req, res) => {
  // Get pushSubscription object
  var id = req.params.id;
  const subscription = req.body;
  var findEffet_indesirable = await effet_indesirable.findOne({ where: { id: id } });
  // Send 201 - resource created
  res.status(201).json({});
  /* const data = fs.readFileSync('../client/src/assets/img/logo.png');
  console.log("first",data) */
  // Create payload
  const payload = JSON.stringify({
    title: findEffet_indesirable.dataValues.titre,
    body: {
      body: findEffet_indesirable.dataValues.description,      
      icon: "/logo.png",
      /* icon: "http://image.ibb.co/frYOFd/tmlogo.png", */
    },
  });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
});
module.exports = router;

const express = require("express");
const router = express.Router();
var voix_administration = require("../models/voix_administration");
const auth = require("../middlewares/passport");
// Desplay all lignes of client ...
router.post("/addVoix_administration", auth, (req, res) => {
  var id = req.body.id;
  var description = req.body.description;
  var description_en = req.body.description_en;
  var description_ar = req.body.description_ar;
  if (id == 0) {
    voix_administration
      .create({
        description: description,
        description_en: description_en,
        description_ar: description_ar,
        etat: 1,
      })
      .then((r) => {
        return res.status(200).send({data:r,msg:true});
      })
      .catch((error) => {
        return res.status(403).send({error:error,msg:false});
      });
  } else {
    voix_administration.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        voix_administration
          .update({
            description: description,
            description_en: description_en,
            description_ar: description_ar,
            etat: 1,
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
  voix_administration
    .findAll({
      where: { etat: 1 },
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.post("/allVoix_administration",auth, (req, res) => {
  voix_administration.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteVoix_administration/:id", auth, (req, res) => {
  var id = req.params.id;
  voix_administration.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      voix_administration.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getVoix_administration",auth, (req, res) => {
  var id = req.headers["id"];
  voix_administration.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  voix_administration.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      voix_administration
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
  var findVoix_administration = await voix_administration.findOne({ where: { id: id } });
  // Send 201 - resource created
  res.status(201).json({});
  /* const data = fs.readFileSync('../client/src/assets/img/logo.png');
  console.log("first",data) */
  // Create payload
  const payload = JSON.stringify({
    title: findVoix_administration.dataValues.titre,
    body: {
      body: findVoix_administration.dataValues.description,      
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

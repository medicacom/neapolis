const express = require("express");
const router = express.Router();
var gouvernorat = require("../models/gouvernorat");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
router.post("/allGouvernorat", (req, res) => {
  gouvernorat.findAll({where: { id: { [Op.ne]: 0 } },order:[["id","desc"]]}).then(function (r) {
    return res.status(200).send(r);
  });
});

module.exports = router;

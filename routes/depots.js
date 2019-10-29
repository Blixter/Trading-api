const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");
const depots = require("../models/depots.js");

router.get("/view",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.view(res, req));

router.put("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.update(res, req));

module.exports = router;

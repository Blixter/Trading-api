const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");
const objects = require("../models/objects.js");

router.get("/view",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.viewAll(res, req));

router.post("/viewUser",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.viewUser(req, res));

router.post("/buy",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.buy(req, res));

router.post("/sell",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => objects.sell(req, res));

router.put("/",
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => depots.update(res, req));

module.exports = router;

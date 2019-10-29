const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.post('/login', (req, res) => auth.login(res, req.body));
router.post('/register', (req, res) => auth.register(res, req.body));

router.get('/check',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => auth.ValidTokenResponse(req, res));

router.get('/user',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => auth.getUser(req, res));

module.exports = router;

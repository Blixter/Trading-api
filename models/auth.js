const db = require("../db/database.js");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Config with environment variables
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const auth = {
    login: function(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "User not found",
                            detail: "User with provided email not found."
                        }
                    });
                }

                const user = rows;

                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/login",
                                title: "bcrypt error",
                                detail: "bcrypt error"
                            }
                        });
                    }

                    if (result) {
                        let payload = { email: user.email };
                        let jwtToken = jwt.sign(payload, secret, { expiresIn: '24h' });

                        return res.json({
                            type: "success",
                            message: "User logged in",
                            user: payload,
                            token: jwtToken
                        });
                    }

                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "Wrong password",
                            detail: "Password is incorrect."
                        }
                    });
                });
            });
    },

    getUser: function(res, req) {
        db.all("SELECT * FROM users WHERE email = ?",
            req.user.email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                return res.json( rows );
            });
    },


    register: function(res, body) {
        const firstname = body.firstname;
        const lastname = body.lastname;
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            db.run("INSERT INTO users (firstname, lastname, "
            + "email, password) VALUES (?, ?, ?, ?)",
            firstname,
            lastname,
            email,
            hash, (err) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/register",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                // Create depot for user
                db.run("INSERT INTO depots (user_email) " +
                "VALUES (?)",
                email, (err) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/register",
                                title: "Database error",
                                detail: err.message
                            }
                        });
                    }
                })
                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            });
        });
    },

    checkToken: function(req, res, next) {
        var token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;
                next();

                return undefined;
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    },

    ValidTokenResponse: function(req, res) {
        return res.json({
            status: 200,
            type: "success",
            message: "Valid token"
        });
    }

};

module.exports = auth;

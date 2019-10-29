const db = require("../db/database.js");

// Config with environment variables
require('dotenv').config();

const depot = {
    view: function(res, req) {
        let objectContent = [];
        
        db.all("SELECT " +
            "u.email AS user_email, " +
            "d.balance, " +
            "d.user_email AS depot_email, " +
            "object_rowid, " +
            "amount, " +
            "o.name AS object_name " +
            "FROM users AS u " +
            "LEFT JOIN depots AS d ON u.email = d.user_email " +
            "LEFT JOIN objects_in_depot AS oid ON d.user_email = oid.depot_email " +
            "LEFT JOIN objects AS o ON o.rowid = oid.object_rowid " +
            "WHERE u.email = ?", 
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
                rows.forEach( row => {
                    if(row.amount) {
                        objectContent.push(
                            {
                                name: row.object_name,
                                amount: row.amount
                            })
                    }
                })
                return res.status(200).json({
                    email: rows[0].user_email,
                    balance: rows[0].balance,
                    objects: objectContent
                });
        })
    },
    update: function(res, req) {
        sql = "UPDATE depots SET balance = ?" +
        " WHERE user_email = ?";

        db.run(
            sql,
            req.body.balance,
            req.user.email,
            function (err) {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "PUT /depots UPDATE",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }

                return res.status(204).send();
            });
    },
    // Update balance without returning res.status
    updateBalance: function(req, res) {
        sql = "UPDATE depots SET balance = ?" +
        " WHERE user_email = ?";

        db.run(
            sql,
            req.body.balance,
            req.user.email,
            function (err) {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "PUT /depots UPDATE",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }
                return null;
            });
    }
}

module.exports = depot;

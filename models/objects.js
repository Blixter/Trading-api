const db = require("../db/database.js");
const depots = require("./depots");

const objects = {
    // view all objects in database
    viewAll: function(res, req) {
        db.all("SELECT * from objects",
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/objects",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }
                return res.status(200).json(rows);
        })
    },
    // View users all objects
    viewUser: function(req, res) {
        db.all("SELECT * FROM objects_in_depot " +
        "WHERE depot_email = ?",
        req.user.email,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
                return res.status(200).json(rows);
        })
    },
    // Add new object to Objects_in_depot
    addOid: function(req, res) {
        db.run("INSERT INTO " +
        "objects_in_depot(object_rowid, depot_email, amount) " +
        "VALUES (?, ?, ?)",
        req.body.objectId,
        req.user.email,
        req.body.buyAmount,
        (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            return null
        })
    },
    // Update Objects_in_depot
    updateOid: function(req, res) {
        db.run("UPDATE objects_in_depot SET amount = ? " +
        "WHERE depot_email = ? and object_rowid = ?",
        req.body.amount,
        req.user.email,
        req.body.objectId,
        (err) => {
            if (err) {
                console.log("error")
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            return null;
        })
    },
    // Add new or update object to user
    buy: function(req, res) {
        
        if (!req.body.objectId || !req.body.price) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/objects/buy",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            })
        }
        
        // Check if user already has object
        db.get("SELECT oid.amount, o.price, o.name, balance FROM depots " +
        "JOIN objects_in_depot AS oid ON depot_email = user_email " +
        "JOIN objects AS o ON o.rowid = oid.object_rowid " +
        "WHERE depot_email = ? AND oid.object_rowid = ?",
        req.user.email,
        req.body.objectId,
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects/buy",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }
            // If the object already exist
            if (row) {
                let name = row.name;
                let oldAmount = row.amount;
                let buyAmount = req.body.buyAmount;
                let price = req.body.price;
                let newAmount = parseInt(oldAmount) + parseInt(buyAmount);
                // How much it will cost
                let objectPrice = buyAmount * price

                // If there is enough balance in depot
                if (row.balance >= objectPrice) {
                    // Add new depot balance and object amount to body
                    req.body.balance = row.balance - objectPrice
                    req.body.amount = newAmount
                    // Run an update on deposit balance for user
                    depots.updateBalance(req, res)
                    // Run update on object amount for user
                    objects.updateOid(req, res)
                    return res.status(200).json({
                        message: `Bought ${buyAmount} ${name} for ${objectPrice} kr.`
                    })
                // Not enough balance
                } else {
                    return res.json({
                    message: "Not enough balance"
                })}
            // Object doesn't exist in Depot
            } else {
                db.get("SELECT balance, " +
                "(SELECT price FROM objects WHERE rowid = ?) AS price, " +
                "(SELECT name FROM objects WHERE rowid = ?) AS name " +
                "FROM depots WHERE user_email = ?",
                req.body.objectId,
                req.body.objectId,    
                req.user.email,
                    (err, row) => {
                        if (err) {
                            return res.status(500).json({
                                errors: {
                                    status: 500,
                                    source: "/objects/buy",
                                    title: "Database error",
                                    detail: err.message
                                }
                            });
                        }
                        let balance = row.balance;
                        let buyAmount = req.body.buyAmount;
                        let price = req.body.price;
                        let name = row.name;
                        // How much it will cost
                        let objectPrice = buyAmount * price;
                        // If there is enough balance
                        if (balance >= objectPrice) {
                            // Add new balance to body
                            req.body.balance = balance - objectPrice
                            // Run an update on deposit balance for user
                            depots.updateBalance(req, res)
                            // Insert the object in depot
                            objects.addOid(req, res)
                            
                            return res.json({
                                message: `Bought ${buyAmount} ${name} for ${objectPrice} kr.`
                            })

                        // Not enough balance
                        } else {
                            return res.json({
                                message: "Not enough balance"
                            })
                        }
                    }
                )
            }
        }
    )},
    // Add new or update object to user
    sell: function(req, res) {

        if (!req.body.objectId || !req.body.price) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/objects/sell",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            })
        }

        // Check if object exist in users depot
        db.get("SELECT oid.amount, o.name, o.price, balance FROM depots " +
        "JOIN objects_in_depot AS oid ON depot_email = user_email " +
        "JOIN objects AS o ON o.rowid = oid.object_rowid " +
        "WHERE depot_email = ? AND oid.object_rowid = ?",
        req.user.email,
        req.body.objectId,
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/objects",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }   
                // If object exists in row
                if (row) {
                    let name = row.name;
                    let amount = row.amount;
                    let sellAmount = req.body.sellAmount;
                    let price = req.body.price;
                    let balance = row.balance;
                    // If there is enough object to sell
                    if (amount >= sellAmount) {
                        req.body.amount = amount - sellAmount;
                        // Calculate new amount
                        let sellPrice = (price * sellAmount);
                        let newBalance = balance + sellPrice;
                        req.body.balance = newBalance;
                        // Update balance in users depot
                        depots.updateBalance(req, res)
                        // Update amount of objects in users depot
                        objects.updateOid(req, res)
                        return res.json({
                            message: `Sold ${sellAmount} ${name} for ${sellPrice} kr.`
                        })
                    } else {
                        return res.json({
                            message: "Not enough objects"
                        })
                    }
                } else {
                    return res.json({
                        message: "Object doesn't exist in user depot"
                    })
                }

        })
    }
       
}

module.exports = objects;
/* global it describe */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const db = require("../db/database.js");

chai.should();

chai.use(chaiHttp);

let token = "";

describe('depots', () => {
    before(() => {
        return new Promise((resolve) => {
            db.run("DELETE FROM depots", (err) => {
                if (err) {
                    console.error("Could not empty test DB table depots", err.message);
                }

                // db.run("INSERT INTO depots (user_email, balance) VALUES ('test@example.com', 1000)", (err) => {
                //     if (err) {
                //         console.error("Could not insert into test DB table depots", err.message);
                //     }

                    db.run("DELETE FROM users", (err) => {
                        if (err) {
                            console.error("Could not empty test DB table users", err.message);
                        }

                        resolve();
                    });
                });
            });
        });
    });

describe("Auth - To get a new token", () => {
    // In case user doesn't exist already in the db.
    let user = {
        firstname: "test",
        lastname: "test",
        email: "test@example.com",
        password: "123test"
    };

    chai.request(server)
        .post("/auth/register")
        .send(user);

    // Login to get the token
    it('should get 201', (done) => {
        let user = {
            email: "test@example.com",
            password: "123test"
        };

        chai.request(server)
            .post("/auth/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("type");
                res.body.should.have.property("user");
                res.body.type.should.equal("success");
                res.body.should.have.property("type");
                res.body.should.have.property("token");
                token = res.body.token;

                done();
            });
    });
});

describe('GET /depots/view', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .get('/depots/view')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 200 as we do provide token', (done) => {
        chai.request(server)
            .get('/depots/view')
            .set("x-access-token", token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                done();
            });
    });
});

describe('PUT /depots', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .put('/depots')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 500 as we do provide token but not balance', (done) => {
        chai.request(server)
            .put('/depots')
            .set("x-access-token", token)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.an("object");
                done();
            });
    });

    it('should get 204 as we do provide token and balance', (done) => {
        chai.request(server)
            .put('/depots')
            .set("x-access-token", token)
            .send({balance: 1000})
            .end((err, res) => {
                res.should.have.status(204);
                res.body.should.be.an("object");
                done();
            });
    });
});
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

                    db.run("DELETE FROM users", (err) => {
                        if (err) {
                            console.error("Could not empty test DB table users", err.message);
                        }

                        resolve();
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

describe('GET /objects/view', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .get('/objects/view')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 200 as we do provide token', (done) => {
        chai.request(server)
            .get('/objects/view')
            .set("x-access-token", token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('POST /objects/viewUser', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .post('/objects/viewUser')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 200 as we do provide token', (done) => {
        chai.request(server)
            .post('/objects/viewUser')
            .set("x-access-token", token)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('POST /objects/buy', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .post('/objects/buy')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 as we do not provide objectId', (done) => {
        data = {
            // objectId: 1,
            buyAmount: 10,
            price: 100,
        }
        chai.request(server)
            .post('/objects/buy')
            .set("x-access-token", token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 200 as we do provide token', (done) => {
        data = {
            objectId: 1,
            buyAmount: 10,
            price: 100,
        }
        chai.request(server)
            .post('/objects/buy')
            .set("x-access-token", token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("message");
                done();
            });
    });
});

describe('POST /objects/sell', () => {
    it('should get 401 as we do not provide valid token', (done) => {
        chai.request(server)
            .post('/objects/sell')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 as we do not provide objectId', (done) => {
        data = {
            // objectId: 1,
            buyAmount: 10,
            price: 100,
        }
        chai.request(server)
            .post('/objects/sell')
            .set("x-access-token", token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 200 as we do provide token', (done) => {
        data = {
            objectId: 1,
            buyAmount: 10,
            price: 100,
        }
        chai.request(server)
            .post('/objects/sell')
            .set("x-access-token", token)
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object");
                res.body.should.have.property("message");
                done();
            });
    });
});
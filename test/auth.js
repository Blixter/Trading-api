/* global it describe before */

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('POST /register', () => {
    it('should get 401 as we do not provide email', (done) => {
        let user = {
            //email: "test@example.com",
            password: "123test",
        };

        chai.request(server)
            .post("/auth/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 as we do not provide password', (done) => {
        let user = {
            email: "test@example.com",
            // password: "123test",
        };

        chai.request(server)
            .post("/auth/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 201 HAPPY PATH', (done) => {
        let user = {
            firstname: "test",
            lastname: "test",
            birthdate: "19890924",
            email: "test@example.com",
            password: "123test"
        };

        chai.request(server)
            .post("/auth/register")
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.an("object");
                res.body.should.have.property("data");
                res.body.data.should.have.property("message");
                res.body.data.message.should.equal("User successfully registered.");

                done();
            });
    });
});

describe('POST /auth/login', () => {
    it('should get 401 as we do not provide email', (done) => {
        let user = {
            //email: "test@example.com",
            password: "123test",
        };

        chai.request(server)
            .post("/auth/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 as we do not provide password', (done) => {
        let user = {
            email: "test@example.com",
            // password: "123test",
        };

        chai.request(server)
            .post("/auth/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 as user not found', (done) => {
        let user = {
            email: "nobody@example.com",
            password: "123test"
        };

        chai.request(server)
            .post("/auth/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 401 incorrect password', (done) => {
        let user = {
            email: "test@example.com",
            password: "wrongpassword"
        };

        chai.request(server)
            .post("/auth/login")
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.an("object");
                res.body.errors.status.should.be.equal(401);
                done();
            });
    });

    it('should get 201 HAPPY PATH', (done) => {
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
                process.env.TOKEN = res.body.token;

                done();
            });
    });
});


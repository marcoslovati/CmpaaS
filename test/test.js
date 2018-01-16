var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var should = chai.should();
var baseUrl = 'http://localhost:3000/v1';
chai.use(chaiHttp);

describe('##USER API (not allowed methods)##', () => {
    it('#Post to specific user', (done) => {
        chai.request(baseUrl)
            .post('/users/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Get of one join', (done) => {
        chai.request(baseUrl)
            .get('/users/1234/join/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Post of one join', (done) => {
        chai.request(baseUrl)
            .post('/users/1234/join/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Delete of one join', (done) => {
        chai.request(baseUrl)
            .delete('/users/1234/join/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Get of one leave', (done) => {
        chai.request(baseUrl)
            .get('/users/1234/leave/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Post of one leave', (done) => {
        chai.request(baseUrl)
            .post('/users/1234/leave/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
    it('#Delete of one leave', (done) => {
        chai.request(baseUrl)
            .delete('/users/1234/leave/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-6');
                done();
            });
    });
});

describe('##USER API Test (/users) ##', () => {
    var firstUser, secondUser;
    it('#Get a empty userlist', (done) => {
        chai.request(baseUrl)
            .get('/users/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
    it('#Post a new user without send a JSON Object', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-10');
                done();
            });
    });
    it('#Post a new user without required fields (all)', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                company: 'UFES'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-2');
                expect(response.body.userMessage).to.include('username');
                expect(response.body.userMessage).to.include('email');
                expect(response.body.userMessage).to.include('password');
                done();
            });
    });
    it('#Post a new user without required fields (except name)', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-2');
                expect(response.body.userMessage).to.include('username');
                expect(response.body.userMessage).to.include('email');
                expect(response.body.userMessage).to.include('password');
                done();
            });
    });
    it('#Post a new user without required fields (email and password)', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner Perin',
                username: 'wagnerperin'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-2');
                expect(response.body.userMessage).to.not.include('username');
                expect(response.body.userMessage).to.include('email');
                expect(response.body.userMessage).to.include('password');
                done();
            });
    });
    it('#Post a new user without required fields (password)', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner Perin',
                username: 'wagnerperin',
                email: 'wagnerperin@gmail.com'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-2');
                expect(response.body.userMessage).to.not.include('username');
                expect(response.body.userMessage).to.not.include('email');
                expect(response.body.userMessage).to.include('password');
                done();
            });
    });
    it('#Post a new user with a group set', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner Perin',
                username: 'wagnerperin',
                email: 'wagnerperin@gmail.com',
                password: '1234',
                groups: [
                    {
                        _id: '123',
                        name: 'CMPaaS',
                    }
                ]
            })
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(201);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('user');
                expect(response.body.alertMessage).to.include('groups');
                firstUser = response.body.user._id;
                done();
            });
    });
    it('#Post a new user without a group set', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Priscilla Demoner',
                username: 'priscillademoner',
                email: 'priscillademoner@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(201);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('user');
                expect(response.body.alertMessage).to.be.empty;
                secondUser = response.body.user._id;
                done();
            });
    });
    it('#Post a repeated user data', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Priscilla Demoner',
                username: 'priscillademoner',
                email: 'priscillademoner@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-3');
                expect(response.body.devMessage.op).to.have.property('name');
                expect(response.body.devMessage.op).to.not.have.property('password');
                done();
            });
    });
    it('#Get a not empty userlist', (done) => {
        chai.request(baseUrl)
            .get('/users/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('array').that.not.is.empty;
                expect(response.body).to.have.lengthOf(2);
                expect(response.body[0]).to.be.an('object');
                expect(response.body[0]).to.not.have.property('password');
                expect(response.body[0].username).to.be.equal('wagnerperin');
                done();
            });
    });
    it('#Put a bulk user update without send an array', (done) => {
        chai
            .request(baseUrl)
            .put('/users/')
            .type('application/json')
            .send(
                {
                    _id: firstUser,
                    name: "Name 0"
                },
                {
                    _id: secondUser,
                    name: "Name 1"
                }
            )
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('userMessage');
                expect(response.body.errorCode).to.be.equal('users-4');
                done();
            })
    });
    it('#Put a bulk user update with one wrong ID format', (done) => {
        chai
            .request(baseUrl)
            .put('/users/')
            .type('application/json')
            .send([
                {
                    _id: 'xxxxx',
                    name: "Name 0"
                },
                {
                    _id: secondUser,
                    name: "Name 1"
                }
            ])
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('userMessage');
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            })
    });
    it('#Put a bulk user update (partial update)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/')
            .type('application/json')
            .send([
                {
                    _id: firstUser.replace(firstUser.substring(0,1), firstUser.substring(1,2)),
                    name: "Name 0"
                },
                {
                    _id: secondUser,
                    name: "Name 1"
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('1 of 1');
                done();
            })
    });
    it('#Put a bulk user update (complete update)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/')
            .type('application/json')
            .send([
                {
                    _id: firstUser,
                    name: "Wagner de Andrade Perin"
                },
                {
                    _id: secondUser,
                    name: "Priscilla Nara de Castro Demoner"
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('2 of 2');
                done();
            })
    });
    it('#Put a bulk user update (partial update)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/')
            .type('application/json')
            .send([
                {
                    _id: firstUser,
                    name: 'Wagner de Andrade Perin'
                },
                {
                    _id: secondUser,
                    name: 'Priscilla Demoner'
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('1 of 2');
                done();
            })
    });
    it('#Get to check updated names of users', (done) => {
        chai.request(baseUrl)
            .get('/users/')
            .end((error, response) => {
                expect(response.body[0]).to.be.an('object');
                expect(response.body[0].name).to.equal('Wagner de Andrade Perin');
                expect(response.body[1]).to.be.an('object');
                expect(response.body[1].name).to.equal('Priscilla Demoner');
                done();
            });
    });
    it('#Delete all users', (done) => {
        chai.request(baseUrl)
            .delete('/users/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Get a empty userlist', (done) => {
        chai.request(baseUrl)
            .get('/users/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
});

describe('##SPECIFIC USER API Test (/users/:id) ##', () => {
    var firstUser;
    it('#Post a new user', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                username: 'wagnerperin',
                name: 'Wagner de Andrade Perin',
                email: 'wagnerperin@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                expect(response.body.user).to.not.have.property('password');
                expect(response.body.user).to.have.property('link');
                expect(response.body.user.link).to.have.property('href');
                expect(response.body.user.link.href).to.include(response.body.user._id);
                firstUser = response.body.user._id;
                done();
            });
    });
    it('#Get a error to find specific user (invalid ID format)', (done) => {
        chai
            .request(baseUrl)
            .get('/users/'+(firstUser+'1'))
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('errorCode');
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            })
    });
    it('#Get a error to find specific user (invalid ID number)', (done) => {
        chai
            .request(baseUrl)
            .get('/users/'+firstUser.replace(firstUser.substring(0,1), firstUser.substring(1,2)))
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-7');
                expect(response.body).to.have.property('userMessage');
                done();
            })
    });
    it('#Get a specific user', (done) => {
        chai
            .request(baseUrl)
            .get('/users/'+firstUser)
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('username');
                expect(response.body).to.have.property('name');
                expect(response.body).to.not.have.property('password');
                expect(response.body).to.have.property('link');
                expect(response.body.link).to.have.property('href');
                expect(response.body.link.href).to.include(response.body._id);
                done();
            });
    });
    it('#Put a specific user update (not sending a json object)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/'+firstUser)
            .send([])
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-10')
                done();
            });
    });
    it('#Put a specific user update (wrong ID format)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/'+firstUser+'1')
            .send({
                name: 'Wagner Perin'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-5')
                done();
            });
    });
    it('#Put a specific user update (wrong ID number)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/'+firstUser.replace(firstUser.substring(0,1), firstUser.substring(1,2)))
            .send({
                name: 'Wagner Perin'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-7')
                done();
            });
    });
    it('#Put a specific user update (with grouplist update)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/'+firstUser)
            .send({
                name: 'Wagner Perin',
                groups: [
                    {
                        _id: '1234',
                        name: 'CMPaaS'
                    }
                ]
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.alertMessage).to.include('make changes')
                done();
            });
    });
    it('#Put a specific user update (without grouplist update)', (done) => {
        chai
            .request(baseUrl)
            .put('/users/'+firstUser)
            .send({
                name: 'Wagner Perin'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.alertMessage).to.not.include('make changes')
                done();
            });
    });
    it('#Delete a specific user (with wrong ID format)', (done) => {
        chai
            .request(baseUrl)
            .delete('/users/'+firstUser+'1')
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('users-5')
                done();
            });
    });
    it('#Delete a specific user', (done) => {
        chai
            .request(baseUrl)
            .delete('/users/'+firstUser)
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Get a empty userlist', (done) => {
        chai.request(baseUrl)
            .get('/users/')
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
    it('#Delete all users', (done) => {
        chai.request(baseUrl)
            .delete('/users/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
});
describe('##GROUP API (not allowed methods)##', () => {
    it('#Post to specific group', (done) => {
        chai.request(baseUrl)
            .post('/groups/1234')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Get to include url', (done) => {
        chai.request(baseUrl)
            .get('/groups/1234/include')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Post to include url', (done) => {
        chai.request(baseUrl)
            .post('/groups/1234/include')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Get to include url', (done) => {
        chai.request(baseUrl)
            .get('/groups/1234/include')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Delete to include url', (done) => {
        chai.request(baseUrl)
            .delete('/groups/1234/include')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Post to remove url', (done) => {
        chai.request(baseUrl)
            .post('/groups/1234/remove')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Get to remove url', (done) => {
        chai.request(baseUrl)
            .get('/groups/1234/remove')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
    it('#Delete to remove url', (done) => {
        chai.request(baseUrl)
            .delete('/groups/1234/remove')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(405);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-7');
                done();
            });
    });
});
describe('##GROUP API Test (/groups) ##', () => {
    var firstGroup, secondGroup;
    it('#Get a empty grouplist', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
    it('#Post a new grouop without send a JSON Object', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-8');
                done();
            });
    });
    it('#Post a new group without required fields (all)', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                company: 'UFES'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-4');
                expect(response.body.userMessage).to.include('name');
                expect(response.body.userMessage).to.include('description');
                done();
            });
    });
    it('#Post a new group without required fields (except name)', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                descrpton: 'CMPaaS Group'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-4');
                expect(response.body.userMessage).to.include('name');
                done();
            });
    });
    it('#Post a new group with a userlist set', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'CMPaaS',
                description: 'CMPaaS Group',
                users: [
                    {
                        _id: '123',
                        name: 'Wagner Pern',
                    }
                ]
            })
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(201);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('group');
                expect(response.body.alertMessage).to.include('users');
                firstGroup = response.body.group._id;
                done();
            });
    });
    it('#Post a new group without a userlist set', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'Admin',
                description: 'Admin Group'
            })
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(201);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('group');
                expect(response.body.alertMessage).to.be.empty;
                secondGroup = response.body.group._id;
                done();
            });
    });
    it('#Post a repeated group data', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'Admin',
                description: 'Admin Group'
            })
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-5');
                expect(response.body.devMessage.op).to.have.property('name');
                done();
            });
    });
    it('#Get a not empty grouplist', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('array').that.not.is.empty;
                expect(response.body).to.have.lengthOf(2);
                expect(response.body[0]).to.be.an('object');
                expect(response.body[0]).to.have.property('name');
                expect(response.body[0].name).to.be.equal('CMPaaS');
                done();
            });
    });
    it('#Put a bulk group update without send an array', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/')
            .type('application/json')
            .send(
                {
                    _id: firstGroup,
                    name: "Name 0"
                },
                {
                    _id: secondGroup,
                    name: "Name 1"
                }
            )
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('userMessage');
                expect(response.body.errorCode).to.be.equal('groups-6');
                done();
            })
    });
    it('#Put a bulk group update with one wrong ID format', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/')
            .type('application/json')
            .send([
                {
                    _id: 'xxxxx',
                    name: "Name 0"
                },
                {
                    _id: secondGroup,
                    name: "Name 1"
                }
            ])
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('userMessage');
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            })
    });
    it('#Put a bulk group update (partial update)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/')
            .type('application/json')
            .send([
                {
                    _id: firstGroup.replace(firstGroup.substring(0,1), firstGroup.substring(1,2)),
                    name: "Name 0"
                },
                {
                    _id: secondGroup,
                    name: "Name 1"
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('1 of 1');
                done();
            })
    });
    it('#Put a bulk group update (complete update)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/')
            .type('application/json')
            .send([
                {
                    _id: firstGroup,
                    name: "CMPaaS Group"
                },
                {
                    _id: secondGroup,
                    name: "Admin Group"
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('2 of 2');
                done();
            })
    });
    it('#Put a bulk group update (partial update)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/')
            .type('application/json')
            .send([
                {
                    _id: firstGroup,
                    name: 'CMPaaS'
                },
                {
                    _id: secondGroup,
                    name: 'Admin Group'
                }
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.userMessage).to.include('1 of 2');
                done();
            })
    });
    it('#Get to check updated names of groups', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(response.body[0]).to.be.an('object');
                expect(response.body[0].name).to.equal('CMPaaS');
                expect(response.body[1]).to.be.an('object');
                expect(response.body[1].name).to.equal('Admin Group');
                done();
            });
    });
    it('#Delete all groups', (done) => {
        chai.request(baseUrl)
            .delete('/groups/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Get a empty grouplist', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
});
describe('##SPECIFIC GROUP API Test (/groups/:id) ##', () => {
    var firstGroup;
    it('#Post a new group', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'CMPaaS',
                description: 'CMPaaS Group'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                expect(response.body.group).to.have.property('link');
                expect(response.body.group.link).to.have.property('href');
                expect(response.body.group.link.href).to.include(response.body.group._id);
                firstGroup = response.body.group._id;
                done();
            });
    });
    it('#Get a error to find specific group (invalid ID format)', (done) => {
        chai
            .request(baseUrl)
            .get('/groups/'+(firstGroup+'1'))
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('errorCode');
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            })
    });
    it('#Get a error to find specific group (invalid ID number)', (done) => {
        chai
            .request(baseUrl)
            .get('/groups/'+firstGroup.replace(firstGroup.substring(0,1), firstGroup.substring(1,2)))
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-1');
                expect(response.body).to.have.property('userMessage');
                done();
            })
    });
    it('#Get a specific group', (done) => {
        chai
            .request(baseUrl)
            .get('/groups/'+firstGroup)
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body).to.have.property('name');
                expect(response.body).to.have.property('link');
                expect(response.body.link).to.have.property('href');
                expect(response.body.link.href).to.include(response.body._id);
                done();
            });
    });
    it('#Put a specific group update (not sending a json object)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/'+firstGroup)
            .send([])
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-8')
                done();
            });
    });
    it('#Put a specific group update (wrong ID format)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/'+firstGroup+'1')
            .send({
                name: 'Admin'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-2')
                done();
            });
    });
    it('#Put a specific group update (wrong ID number)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/'+firstGroup.replace(firstGroup.substring(0,1), firstGroup.substring(1,2)))
            .send({
                name: 'Admin'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-1')
                done();
            });
    });
    it('#Put a specific group update (with userlist update)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/'+firstGroup)
            .send({
                name: 'Admin',
                users: [
                    {
                        _id: '1234',
                        name: 'Wagner Perin'
                    }
                ]
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.alertMessage).to.include('make changes')
                done();
            });
    });
    it('#Put a specific group update (without userlist update)', (done) => {
        chai
            .request(baseUrl)
            .put('/groups/'+firstGroup)
            .send({
                name: 'CMPaaS'
            })
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.alertMessage).to.not.include('make changes')
                done();
            });
    });
    it('#Delete a specific group (with wrong ID format)', (done) => {
        chai
            .request(baseUrl)
            .delete('/groups/'+firstGroup+'1')
            .type('application/json')
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response).to.be.json;
                expect(response).to.have.headers;
                expect(response).to.have.header('Content-Type', /json/);
                expect(response.body).to.be.an('object');
                expect(response.body.errorCode).to.be.equal('groups-2')
                done();
            });
    });
    it('#Delete a specific group', (done) => {
        chai
            .request(baseUrl)
            .delete('/groups/'+firstGroup)
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Get a empty grouplist', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body).to.be.an('array').that.is.empty;
                done();
            });
    });
    it('#Delete all groups', (done) => {
        chai.request(baseUrl)
            .delete('/groups/')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
});
describe('##USERS JOIN AND LEAVE GROUPS (/users/:userId/join(leave)/:groupId)##', () => {
    var firstUser, firstGroup;
    var firstGroup, secondGroup;

    it('#Post a first user', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner Perin',
                username: 'wagnerperin',
                email: 'wagnerperin@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                firstUser = response.body.user._id;
                done();
            });
    });
    it('#Post a second user', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Priscilla Demoner',
                username: 'priscillademoner',
                email: 'priscillademoner@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                secondUser = response.body.user._id;
                done();
            });
    });

    it('#Post a first group', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'CMPaaS',
                description: 'CMPaaS Group'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                firstGroup = response.body.group._id;
                done();
            });
    });
    it('#Post a second group', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'Admin',
                description: 'Admin Group'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                secondGroup = response.body.group._id;
                done();
            });
    });
    it('#Put a join (wrong user ID format)', (done) => {
        chai.request(baseUrl)
            .put('/users/xxxx/join/'+secondGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            });
    });
    it('#Put a join (wrong user ID number)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+firstUser.replace(firstUser.substring(0,1), firstUser.substring(1,2))+'/join/'+secondGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('users-7');
                done();
            });
    });
    it('#Put a join (wrong group ID format)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+firstUser+'/join/xx'+secondGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            });
    });
    it('#Put a join (wrong group ID number)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+firstUser+'/join/'+firstGroup.replace(firstGroup.substring(0,1), firstGroup.substring(1,2)))
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('groups-1');
                done();
            });
    });
    it('#Put a join (firstUser with firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+firstUser+'/join/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.user.groups).to.be.an('array').that.is.not.empty;
                expect(response.body.user.groups[0]._id).to.be.equal(firstGroup);
                expect(response.body.user.groups[0]).to.have.property('link');
                expect(response.body.user).to.have.property('link');
                done();
            });
    });
    it('#Put a repeated join (firstUser with firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+firstUser+'/join/'+firstGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-8');
                done();
            });
    });
    it('#Put a join (secondUser with firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/join/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.user.groups).to.be.an('array').that.is.not.empty;
                expect(response.body.user.groups[0]._id).to.be.equal(firstGroup);
                expect(response.body.user.groups[0]).to.have.property('link');
                expect(response.body.user).to.have.property('link');
                done();
            });
    });
    it('#Get to check a group', (done) => {
        chai.request(baseUrl)
            .get('/groups/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.users).to.be.an('array').that.not.is.empty;
                expect(response.body.users).to.have.lengthOf(2);
                expect(response.body.users[0]).to.be.an('object');
                expect(response.body.users[0]).to.not.have.property('password');
                expect(response.body.users[0]._id).to.be.equal(firstUser);
                expect(response.body.users[1]._id).to.be.equal(secondUser);
                done();
            });
    });
    it('#Delete a specific user', (done) => {
        chai
            .request(baseUrl)
            .delete('/users/'+firstUser)
            .type('application/json')
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Get to check a data integrit of a group', (done) => {
        chai.request(baseUrl)
            .get('/groups/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.users).to.be.an('array').that.not.is.empty;
                expect(response.body.users).to.have.lengthOf(1);
                expect(response.body.users[0]).to.be.an('object');
                expect(response.body.users[0]).to.not.have.property('password');
                expect(response.body.users[0]._id).to.be.equal(secondUser);
                done();
            });
    });
    it('#Put a leave (wrong userId format)', (done) => {
        chai.request(baseUrl)
            .put('/users/xxx'+secondUser+'/leave/'+firstGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            });
    });
    it('#Put a leave (wrong userId number)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser.replace(secondUser.substring(0,1), secondUser.substring(1,2))+'/leave/'+firstGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('users-7');
                done();
            });
    });
    it('#Put a leave (wrong groupId format)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/leave/xxx'+firstGroup)
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            });
    });
    it('#Put a leave (wrong groupId number)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/leave/'+firstGroup.replace(firstGroup.substring(0,1), firstGroup.substring(1,2)))
            .end((error, response) => {
                expect(error).to.not.be.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('groups-1');
                done();
            });
    });
    it('#Put a leave (secondUser and firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/leave/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.user.groups).to.be.an('array').that.is.empty;
                done();
            });
    });
    it('#Get to check a data integrit of a group', (done) => {
        chai.request(baseUrl)
            .get('/groups/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.users).to.be.an('array').that.is.empty;
                done();
            });
    });

    it('#Put a join (secondUser with firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/join/'+firstGroup)
            .end((error, response) => {
                expect(response).to.have.status(200);
                done();
            });
    });
    it('#Put a join (secondUser with secondGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/join/'+secondGroup)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.user.groups).to.be.an('array').that.is.not.empty;
                expect(response.body.user.groups).to.have.lengthOf(2);
                done();
            });
    });
    it('#Put a leave (secondUser and firstGroup)', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/leave/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.user.groups).to.be.an('array').that.is.not.empty;
                expect(response.body.user.groups).to.have.lengthOf(1);
                done();
            });
    });
    it('#Get to check a data integrit of a groups', (done) => {
        chai.request(baseUrl)
            .get('/groups/')
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body[0].users).to.be.an('array').that.is.empty;
                expect(response.body[1].users).to.be.an('array').that.is.not.empty;
                done();
            });
    });
    it('#Put a repeated leave error', (done) => {
        chai.request(baseUrl)
            .put('/users/'+secondUser+'/leave/'+firstGroup)
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-9');
                done();
            });
    });
    it('#Delete all groups', (done) => {
        chai.request(baseUrl)
            .delete('/groups/')
            .end((error, response) => {
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Delete all users', (done) => {
        chai.request(baseUrl)
            .delete('/users/')
            .end((error, response) => {
                expect(response).to.have.status(204);
                done();
            });
    });
});
describe('##BULK INCLUDE AND REMOVE USERS TO/FROM GROUPS (/groups/:groupId/include(remove)/)##', () => {
    var group;
    var firstUser, secondUser;

    it('#Post a first user', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Wagner Perin',
                username: 'wagnerperin',
                email: 'wagnerperin@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                firstUser = response.body.user._id;
                done();
            });
    });
    it('#Post a second user', (done) => {
        chai
            .request(baseUrl)
            .post('/users/')
            .type('application/json')
            .send({
                name: 'Priscilla Demoner',
                username: 'priscillademoner',
                email: 'priscillademoner@gmail.com',
                password: '1234'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                secondUser = response.body.user._id;
                done();
            });
    });
    it('#Post a group', (done) => {
        chai
            .request(baseUrl)
            .post('/groups/')
            .type('application/json')
            .send({
                name: 'CMPaaS',
                description: 'CMPaaS Group'
            })
            .end((error, response) => {
                expect(response).to.have.status(201);
                group = response.body.group._id;
                done();
            });
    });
    it('#Put a bulk insert (dont send a array)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/include')
            .type('application/json')
            .send({})
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-6');
                done();
            });
    });
    it('#Put a bulk insert (wrong group ID format)', (done) => {
        chai.request(baseUrl)
            .put('/groups/xx'+group+'/include')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            });
    });
    it('#Put a bulk insert (wrong group ID number)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group.replace(group.substring(0,1), group.substring(1,2))+'/include')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('groups-1');
                done();
            });
    });
    it('#Put a bulk insert (wrong user ID format)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/include')
            .type('application/json')
            .send([
                firstUser.toString() + 'xx',
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            });
    });
    it('#Put a bulk insert (one wrong user ID number)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/include')
            .type('application/json')
            .send([
                firstUser.toString().replace(firstUser.toString().substring(0,1), firstUser.toString().substring(1,2)),
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.group.users).to.have.lengthOf(1);
                done();
            });
    });
    it('#Get de user to check if they are in the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+secondUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(1);
                expect(response.body.groups[0]._id).to.be.equal(group);
                done();
            });
    });
    it('#Put a bulk insert (two ok)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/include')
            .type('application/json')
            .send([
                firstUser.toString(),
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.group.users).to.have.lengthOf(2);
                done();
            });
    });
    it('#Get de user second user to check if they are in the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+secondUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(1);
                expect(response.body.groups[0]._id).to.be.equal(group);
                done();
            });
    });
    it('#Get de first user to check if they are in the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+firstUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(1);
                expect(response.body.groups[0]._id).to.be.equal(group);
                done();
            });
    });
    
    it('#Put a bulk remove (dont send a array)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/remove')
            .type('application/json')
            .send({})
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-6');
                done();
            });
    });
    it('#Put a bulk remove (wrong group ID format)', (done) => {
        chai.request(baseUrl)
            .put('/groups/xx'+group+'/remove')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('groups-2');
                done();
            });
    });
    it('#Put a bulk remove (wrong group ID number)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group.replace(group.substring(0,1), group.substring(1,2))+'/remove')
            .type('application/json')
            .send([])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(404);
                expect(response.body.errorCode).to.be.equal('groups-1');
                done();
            });
    });
    it('#Put a bulk remove (wrong user ID format)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/remove')
            .type('application/json')
            .send([
                firstUser.toString() + 'xx',
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.not.null;
                expect(response).to.have.status(400);
                expect(response.body.errorCode).to.be.equal('users-5');
                done();
            });
    });
    it('#Put a bulk remove (one wrong user ID number)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/remove')
            .type('application/json')
            .send([
                firstUser.toString().replace(firstUser.toString().substring(0,1), firstUser.toString().substring(1,2)),
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.group.users).to.have.lengthOf(1);
                done();
            });
    });
    it('#Get de user to check if they leave the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+secondUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(0);
                done();
            });
    });
    it('#Put a bulk remove (two ok)', (done) => {
        chai.request(baseUrl)
            .put('/groups/'+group+'/remove')
            .type('application/json')
            .send([
                firstUser.toString(),
                secondUser.toString()
            ])
            .end((error, response) => {
                expect(error).to.be.null;
                expect(response).to.have.status(200);
                expect(response.body.group.users).to.have.lengthOf(0);
                done();
            });
    });
    it('#Get the second user to check if they leave the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+secondUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(0);
                done();
            });
    });
    it('#Get de first user to check if they leave the group', (done) => {
        chai.request(baseUrl)
            .get('/users/'+firstUser)
            .end((error, response) => {
                expect(response).to.have.status(200);
                expect(response.body.groups).to.have.lengthOf(0);
                done();
            });
    });

    it('#Delete all groups', (done) => {
        chai.request(baseUrl)
            .delete('/groups/')
            .end((error, response) => {
                expect(response).to.have.status(204);
                done();
            });
    });
    it('#Delete all users', (done) => {
        chai.request(baseUrl)
            .delete('/users/')
            .end((error, response) => {
                expect(response).to.have.status(204);
                done();
            });
    });
});
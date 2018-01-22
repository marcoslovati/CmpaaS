var express = require('express');
var app = express();
var consign = require('consign');
var bodyParser = require('body-parser');

app.use(express.static('./public'));

app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.set('secret', 'cmpaasufes');
app.set('adminGroupName', 'Administrators');


app.set('userApiRoute', '/v1/users/');
app.set('userApiErrorsRoute', '/v1/errors/users/');
app.set('groupApiRoute', '/v1/groups/');
app.set('groupApiErrorsRoute', '/v1/errors/groups/');
app.set('authApiRoute', '/v1/auth/');
app.set('authApiErrorsRoute', '/v1/errors/auth/');
app.set('mapApiRoute', '/v1/maps/');
app.set('mapApiErrorsRoute', '/v1/errors/maps/');


consign({cwd: 'app'})
    .include('helpers')
    .then('models')
    .then('api')
    .then('routes/auth.js')
    .then('routes/group.js')
    .then('routes/map.js')
    .then('routes/swagger.js')
    .then('routes/user.js')
    .then('routes')
    .into(app);

module.exports = app;
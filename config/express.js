var express = require('express');
var app = express();
var consign = require('consign');
var bodyParser = require('body-parser');

app.use(express.static('./public'));

app.use(bodyParser.json());

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
    .then('routes')
    .into(app);

module.exports = app;
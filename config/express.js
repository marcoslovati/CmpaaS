var express = require('express');
var app = express();
var consign = require('consign');
var bodyParser = require('body-parser');
var frontRoot = 'http://localhost:4200';

app.use(express.static('./public'));

app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', frontRoot);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, X-Access-Token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    res.setHeader('Access-Control-Expose-Headers', 'X-Access-Token');

    // Pass to next layer of middleware
    next();
});

app.set('secret', 'Cmp@asUf3s');

app.set('adminGroupName', 'Administradores');
app.set('userApiRoute', '/v1/users/');
app.set('userApiErrorsRoute', '/v1/errors/users/');
app.set('groupApiRoute', '/v1/groups/');
app.set('groupApiErrorsRoute', '/v1/errors/groups/');
app.set('authApiRoute', '/v1/auth/');
app.set('debateApiRoute', '/v1/debates/');
app.set('debateUnityApiRoute', '/v1/debateUnities/');
app.set('authApiErrorsRoute', '/v1/errors/auth/');
app.set('mapApiRoute', '/v1/maps/');
app.set('mapApiErrorsRoute', '/v1/errors/maps/');
app.set('mapContentApiRoute', '/v1/mapContent/');
app.set('mapContentApiErrorsRoute', '/v1/errors/mapContent/');
app.set('facebookUrl', 'https://graph.facebook.com/me?fields=name%2Cemail&access_token=');
app.set('googleUrl', 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=');
app.set('defaultPassword', '!@#123Cmpaas'); //used to set default password to users from facebook and other authentication methods

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
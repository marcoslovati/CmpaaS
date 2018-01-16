module.exports = app => {
    var api = app.api.map;
    var authApi = app.api.auth;

    app
        .route('/v1/maps')
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
}
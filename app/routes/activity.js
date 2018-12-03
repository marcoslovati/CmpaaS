module.exports = app => {
    var api = app.api.activity;
    var authApi = app.api.auth;

    app
        .route('/v1/activities')
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.findByCreator);

    app
        .route('/v1/activities/:id')
        .get(authApi.authenticationRequired, api.findById)
        .put(authApi.authenticationRequired, api.update);

    app
        .route('/v1/activities/name/:name')
        .get(authApi.authenticationRequired, api.findByName);
}
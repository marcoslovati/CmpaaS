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

    app
        .route('/v1/activities/user/:userId')
        .get(authApi.authenticationRequired, api.findByUser);

    app
        .route('/v1/activities/:activityId/include')
        .put(authApi.authenticationRequired, api.include);
    
    app
        .route('/v1/activities/:activityId/remove')
        .put(authApi.authenticationRequired, api.remove);
}
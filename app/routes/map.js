module.exports = app => {
    var api = app.api.map;
    var authApi = app.api.auth;

    app
        .route('/v1/maps')
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list);
    
     app
        .route('/v1/maps/:mapId')
        .get(authApi.authenticationRequired, api.findById);
    
    app
        .route('/v1/maps/:mapId/content')
        .post(authApi.authenticationRequired, api.createContent);

    app
        .route('/v1/maps/date/:mapDate')
        .get(authApi.authenticationRequired, api.findByDate);
}
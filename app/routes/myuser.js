module.exports = app => {
    var api = app.api.myuser;
    var authApi = app.api.auth;
    app
        .route('/v1/myuser')
        .get(authApi.authenticationRequired, api.myUser);
    
    app
        .route('/v1/myuser/maps')
        .get(authApi.authenticationRequired, api.myMaps);
    
    app
        .route('/v1/myuser/photo')
        .post(authApi.authenticationRequired, api.photo);
}
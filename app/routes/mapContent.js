module.exports = app => {
    var api = app.api.mapContent;
    var authApi = app.api.auth;

    app
        .route('/v1/mapContent')
        .post(authApi.authenticationRequired, api.createOrUpdate);
    
    app
        .route('/v1/mapContents/:mapContentId')
        .get(authApi.authenticationRequired, api.findById);
}
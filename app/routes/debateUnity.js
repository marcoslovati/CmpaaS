module.exports = app => {
    var api = app.api.debateUnity;
    var authApi = app.api.auth;

    app
        .route('/v1/debateUnities')
        .post(authApi.authenticationRequired, api.create);

    app
        .route('/v1/debateUnities/:debateUnityId')
        .get(authApi.authenticationRequired, api.findById)
        .post(authApi.authenticationRequired, api.update);
        
    app
        .route('/v1/debateUnities/debate/:debateId')
        .get(authApi.authenticationRequired, api.findByDebate);        
}
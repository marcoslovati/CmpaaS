module.exports = app => {
    var api = app.api.debate;
    var authApi = app.api.auth;

    app
        .route('/v1/debates')
        .post(authApi.authenticationRequired, api.create);

    app
        .route('/v1/debates/creator')
        .get(authApi.authenticationRequired, api.findByCreator);

    app
        .route('/v1/debates/:debateId')
        .get(authApi.authenticationRequired, api.findById);
        
    app
        .route('/v1/debates/processInitial/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessInitial);

    app
        .route('/v1/debates/processFinal/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessFinal);
}
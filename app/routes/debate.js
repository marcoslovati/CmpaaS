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
        .route('/v1/debates/processLevelsInitial/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessLevelsInitial);

    app
        .route('/v1/debates/processFinal/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessFinal);

    app
        .route('/v1/debates/processClustersInitial/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessClustersInitial);

    app
        .route('/v1/debates/changeStatus/:debateId')
        .put(authApi.authenticationRequired, api.updateStatus);
}
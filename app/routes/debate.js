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
        .route('/v1/debates/processLevelsFinal/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessLevelsFinal);

    app
        .route('/v1/debates/processClustersInitial/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessClustersInitial);

    app
        .route('/v1/debates/processClustersFinal/debate/:debateId')
        .post(authApi.authenticationRequired, api.findByIdAndProcessClustersFinal);
}
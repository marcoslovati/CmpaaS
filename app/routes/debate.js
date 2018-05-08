module.exports = app => {
    var api = app.api.debate;
    var authApi = app.api.auth;

    app
        .route('/v1/debates')
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list);

    app
        .route('/v1/debates/:debateId')
        .get(authApi.authenticationRequired, api.findById);
        
    app
        .route('/v1/debates/creator/:creatorId')
        .get(authApi.authenticationRequired, api.findByCreator);        
}
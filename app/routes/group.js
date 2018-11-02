module.exports = (app) => {
    var api = app.api.group;
    var authApi = app.api.auth;
    app
        .route('/v1/groups')
        .post(authApi.authenticationRequired, api.create)
        .get(authApi.authenticationRequired, api.list)
        .put(authApi.authenticationRequired, api.update)
        .delete(authApi.authenticationRequired, api.removeAll);
    
    app
        .route('/v1/groups/:id')
        .post(authApi.authenticationRequired, api.notAllowed)
        .get(authApi.authenticationRequired, api.findById)
        .put(authApi.authenticationRequired, api.update)
        .delete(authApi.authenticationRequired, api.removeById);

    app
        .route('/v1/groups/admin/:adminId')
        .get(authApi.authenticationRequired, api.findByAdmin);        
    
    app
        .route('/v1/groups/:groupId/include')
        .post(authApi.authenticationRequired, api.notAllowed)
        .get(authApi.authenticationRequired, api.notAllowed)
        .put(authApi.authenticationRequired, api.include)
        .delete(authApi.authenticationRequired, api.notAllowed);
    
    app
        .route('/v1/groups/:groupId/remove')
        .post(authApi.authenticationRequired, api.notAllowed)
        .get(authApi.authenticationRequired, api.notAllowed)
        .put(authApi.authenticationRequired, api.remove)
        .delete(authApi.authenticationRequired, api.notAllowed);

}
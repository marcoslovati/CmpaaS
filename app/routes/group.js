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
        .get(authApi.authenticationRequired, api.findById)
        .put(authApi.authenticationRequired, api.update)
        .delete(authApi.authenticationRequired, api.removeById);

    app
        .route('/v1/groups/filter/:filter')
        .get(authApi.authenticationRequired, api.findByFilter);

    app
        .route('/v1/groups/activity/:activityId')
        .get(authApi.authenticationRequired, api.findByActivity);         

    app
        .route('/v1/groups/admin/:adminId')
        .get(authApi.authenticationRequired, api.findByAdmin);        
    
    app
        .route('/v1/groups/:groupId/include')
        .put(authApi.authenticationRequired, api.include);
    
    app
        .route('/v1/groups/:groupId/remove')
        .put(authApi.authenticationRequired, api.remove);

}
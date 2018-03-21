module.exports = app => {
    var api = app.api.user;
    var authApi = app.api.auth;

    app
        .route('/v1/users')
        .post(api.create)
        .get(api.list)
        .put(api.bulkUpdate)
        .delete(api.removeAll);
    
    app.route('/v1/users/facebook')
        .post(api.fbCreate)
    
    app.route('/v1/users/google')
        .post(api.gCreate)

    app
        .route('/v1/users/me')
        .get(authApi.authenticationRequired, api.me);
    
    app
        .route('/v1/users/photo')
        .post(authApi.authenticationRequired, api.photo);

    app
        .route('/v1/users/:id')
        .post(api.notAllowed)
        .get(api.findById)
        .put(api.update)
        .delete(api.removeById);
    
    app
        .route('/v1/users/:id/join/:groupId')
        .post(api.notAllowed)
        .get(api.notAllowed)
        .put(api.joinGroup)
        .delete(api.notAllowed);
    
    app
        .route('/v1/users/:id/leave/:groupId')
        .post(api.notAllowed)
        .get(api.notAllowed)
        .put(api.leaveGroup)
        .delete(api.notAllowed);
}
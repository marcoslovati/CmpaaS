module.exports = app => {
    var api = app.api.user;
    var authApi = app.api.auth;

    app
        .route('/v1/users')
        .post(api.create)
        .get(authApi.authenticationRequired, api.list)
        .put(authApi.authenticationRequired, api.bulkUpdate)
        .delete(authApi.authenticationRequired, api.removeAll);
    
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
        .get(authApi.authenticationRequired, api.findById)
        .put(authApi.authenticationRequired, api.update)
        .delete(authApi.authenticationRequired, api.removeById);

    app
        .route('/v1/users/:id/isOfAdministratorsGroup')
        .get(authApi.authenticationRequired, api.isOfAdministratorsGroup);

    app
        .route('/v1/users/filter/:filter')
        .get(authApi.authenticationRequired, api.findByFilter);

    app
        .route('/v1/users/group/:groupId')
        .get(authApi.authenticationRequired, api.findByGroup);        

    app
        .route('/v1/users/password/:id')
        .put(authApi.authenticationRequired, api.updatePassword);

    app
        .route('/v1/users/resetPassword/:crypt/:id')
        .put(api.updatePasswordFromEmail);

    app
        .route('/v1/users/resetPasswordForm/:parameter')
        .get(api.resetPasswordForm);

    app
        .route('/v1/users/email/:email')
        .post(api.sendEmail);        
    
    app
        .route('/v1/users/:id/join/:groupId')
        .put(authApi.authenticationRequired, api.joinGroup);
    
    app
        .route('/v1/users/:id/leave/:groupId')
        .put(authApi.authenticationRequired, api.leaveGroup);
}
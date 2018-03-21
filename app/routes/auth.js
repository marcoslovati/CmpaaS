module.exports = app => {
    var api = app.api.auth;

    app
        .route('/v1/auth')
        .post(api.authenticate);
    
    app
        .route('/v1/auth/facebook')
        .post(api.fbAuthenticate);
    
    app
        .route('/v1/test')
        .get(api.authenticationRequired, api.adminRequired, api.test);
};
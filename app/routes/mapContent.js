module.exports = app => {
    var api = app.api.mapContent;
    var authApi = app.api.auth;

    app
        .route('/v1/mapContent')
        .post(authApi.authenticationRequired, api.create)
        .get(api.getContent); // teste

    app
        .route('/v1/mapContent/date/:mapDate')
        .get(authApi.authenticationRequired, api.findByDate);
}
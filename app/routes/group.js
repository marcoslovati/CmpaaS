module.exports = (app) => {
    var api = app.api.group;
    var authApi = app.api.auth;
    app
        .route('/v1/groups')
        .post(api.create)
        .get(api.list)
        .put(api.update)
        .delete(api.removeAll);
    
    app
        .route('/v1/groups/:id')
        .post(api.notAllowed)
        .get(api.findById)
        .put(api.update)
        .delete(api.removeById);

    app
        .route('/v1/groups/admin/:adminId')
        .get(api.findByAdmin);        
    
    app
        .route('/v1/groups/:groupId/include')
        .post(api.notAllowed)
        .get(api.notAllowed)
        .put(api.include)
        .delete(api.notAllowed);
    
    app
        .route('/v1/groups/:groupId/remove')
        .post(api.notAllowed)
        .get(api.notAllowed)
        .put(api.remove)
        .delete(api.notAllowed);

}
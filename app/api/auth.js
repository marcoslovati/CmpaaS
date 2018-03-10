module.exports = app => {
    var mongoose = require('mongoose');
    var jwt = require('jsonwebtoken');
    var api = {};
    var userModel = mongoose.model('User');
    var groupModel = mongoose.model('Group');
    const errorParser = app.helpers.errorParser;

    api.authenticate = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]') || !(req.body.username) || !(req.body.password)) 
            res.status(400).json(errorParser.parse('auth-4', {}))
        else userModel
            .findOne({ username: req.body.username })
            .then(user => {
                if(!user) res.status(400).json(errorParser.parse('auth-1', {}))
                else if(!user.comparePassword(req.body.password))
                    res.status(400).json(errorParser.parse('auth-2', {}))
                else {
                    let usr = user.toObject();
                    delete usr.password;
                    if(usr.groups.some(g => g.name == app.get('adminGroupName'))) usr.isAdmin = true; //Admin check on authentication proccess
                    var token = jwt.sign({ user: usr }, app.get('secret'), { expiresIn: 86400 });
                    res.set('x-access-token', token);
                    res.sendStatus(204);
                }                   
            }, error => res.status(500).json(errorParser.parse('auth-3', error)));
    };

    api.authenticationRequired = (req, res, next) => {
        var token = req.headers['x-access-token'] || req.body.token || req.query.token;
        if(token) 
            jwt.verify(token, app.get('secret'), (error, decoded) => {
                if(error) res.status(401).json(errorParser.parse('auth-5', {}))
                else{
                    req.auth = {};
                    req.auth.user = decoded.user;
                    next();
                }
            });
        else res.status(401).json(errorParser.parse('auth-6', {}));
    };

    api.adminRequired = (req, res, next) => {
        if(!req.auth.user.isAdmin) res.status(401).json(errorParser.parse('auth-7', {}))
        else next();
    };
    
    api.adminOrOwnerRequired = (req, res, next) => {
        if(!req.auth.user.isAdmin && req.params.id != req.auth.user._id) res.status(401).json(errorParser.parse('auth-8', {}))
        else next();
    };

    api.groupAdminRequired = (req, res, next) => {
        groupModel
            .findById(req.params.id)
            .then(group => {
                if(req.auth.user._id != group.admin._id) res.status(401).json(errorParser.parse('auth-9', {}))
                else next();
            }, error => res.status(500).json(errorParser.parse('auth-3', error)));
    };
    
    api.test = (req, res) => {
        res.json({message: 'Ok.'});
    }

    return api;
}
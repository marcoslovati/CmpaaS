module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const userModel = mongoose.model('User');
    const mapModel = mongoose.model('Map');
    const errorParser = app.helpers.errorParser;

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('maps-1', {}))
        else {
            mapModel
                .create(req.body)
                .then(map => {
                    map.link = {
                        rel: 'map',
                        href: app.get('mapApiRoute') + map._id
                    };
                    map.author = req.auth.user;
                    map.save();
                    userModel
                        .findById(req.auth.user._id)
                        .then(user => {
                            user.maps = user.maps || [];
                            user.maps.push(map);
                            user.save();
                            res.status(201).json({
                                userMessage: 'Map created successfully. ',
                                map 
                            });
                        }, error => res.status(500).json(errorParser.parse('users-1', error)));
                }, error => res.status(500).json(errorParser.parse('maps-2', error)));
        }
    };

    api.list = (req, res) => {
        mapModel
            .find({})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-2', error)));
    };

    return api;
}
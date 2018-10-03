module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const userModel = mongoose.model('User');
    const mapModel = mongoose.model('Map');
    const mapContentModel = mongoose.model('MapContent');
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

    api.findById = (req, res) => {
        mapModel
            .findById(req.params.mapId)
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-2', error)));
    };


    api.findByDate = (req, res) => {
        mapModel
            .find({ '$where': 'this.versions.created.toJSON().slice(0, 10) >= ' + '"' + req.params.mapDate + '"', 'author._id':{'$ne':req.auth.user._id}, 'author._id': { $in: req.body }})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-1', error)));
    };

    api.findByDate = (req, res) => {
        mapModel
            .find({ '$where': 'this.versions.created.toJSON().slice(0, 10) >= ' + '"' + req.params.mapDate + '"', 'author._id':{'$ne':req.auth.user._id}, 'author._id': { $in: req.body }})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-1', error)));
    };

    api.findByAuthor = (req, res) => {
        mapModel
            .find({'author._id':req.auth.user._id})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-1', error)));
    };
    
    api.createContent = (req, res) => {
        //req.params.mapId req.body.content
        let saveObject = {};
        saveObject.map = {};
        saveObject.map._id = req.params.mapId;
        saveObject.map.link = {};
        saveObject.map.link.rel = 'map';
        saveObject.map.link.href = '/v1/maps/'+req.params.mapId;
        saveObject.content = req.body.content
        mapContentModel
            .create(saveObject)
            .then(mapContent => {
                mapContent.link = {
                    rel: 'mapContent',
                    href: app.get('mapApiRoute') + req.params.mapId + "/content/" + mapContent._id
                };

                mapModel
                    .findById(req.params.mapId)
                    .then(map => {
                        map.versions.push(mapContent);
                        map.save();
                    });

                res.json(mapContent);
            });
    };

    return api;
}
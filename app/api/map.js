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
            .find({ '$where': 'this.created.toJSON().slice(0, 10) >= ' + '"' + req.params.mapDate + '"', 'author._id':{'$ne':req.auth.user._id}, 'author._id': { $in: req.body }})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-1', error)));
    };

    api.findByAuthor = (req, res) => {
        mapModel
            // .find({'author._id':req.auth.user._id})
            .find({'author._id':req.params.userId})
            .then(maps => res.json(maps), error => error => res.status(500).json(errorParser.parse('maps-1', error)));
    };
    
    api.createOrUpdateContent = (req, res) => {
        //req.params.mapId req.body.content
        let mapContent = {};
        mapContent.map = {};
        mapContent.map._id = req.params.mapId;
        mapContent.map.link = {};
        mapContent.map.link.rel = 'map';
        mapContent.map.link.href = '/v1/maps/'+req.params.mapId;
        mapContent.content = req.body.content;
        mapContent.version = req.body.version;
        mapContent._id = req.body._id;

        console.log(mapContent);

        mapContentModel
        .findOne({"map._id": mapContent.map._id, "version": mapContent.version})
        .then(mapContentFinded => {
            console.log(mapContentFinded);
            if(mapContentFinded){
                mapContentFinded.content = mapContent.content;
                mapContentFinded.save();

                res.status(200).json({
                    userMessage: 'Map updated successfully. ',
                    mapContent: mapContentFinded
                });
            }
            else{
                mapContent._id = undefined;

                mapContentModel
                .create(mapContent)
                .then(mapContentCreated => {
                    mapContentCreated.link = {
                        rel: 'mapContent',
                        href: app.get('mapContentApiRoute') + mapContentCreated._id
                    };
    
                    mapContentCreated.save();

                    mapModel
                    .findById(mapContentCreated.map._id)
                    .then(map => {
                        map.versions.push(mapContentCreated);
                        map.save();
                    }, error => res.status(500).json(errorParser.parse('mapContent-1', error)));

                    res.status(201).json({
                        userMessage: 'Map created successfully. ',
                        mapContent: mapContentCreated
                    });
                });
            } 

        }, error => res.status(500).json(errorParser.parse('mapContent-2', error)));
    };

    return api;
}
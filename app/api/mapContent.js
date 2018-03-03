module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const mapModel = mongoose.model('Map');
    const mapContentModel = mongoose.model('MapContent');
    const errorParser = app.helpers.errorParser;
    
    api.create = (req, res) => {
        mapContentModel
            .create(req.body)
            .then(mapContent => {
                mapContent.link = {
                    rel: 'mapContent',
                    href: app.get('mapContentApiRoute') + mapContent._id
                };
                mapModel
                    .findById(req.body.map._id)
                    .then(map => {
                        map.versions.push(mapContent);
                        map.save();
                    }, error => res.status(500).json(errorParser.parse('mapContent-1', error)));
                res.status(201).json({
                    userMessage: 'Map created successfully. ',
                    mapContent
                });
            }, error => res.status(500).json(errorParser.parse('maps-2', error)));
    };

    return api;
}
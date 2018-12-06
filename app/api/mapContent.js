module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const mapModel = mongoose.model('Map');
    const mapContentModel = mongoose.model('MapContent');
    const errorParser = app.helpers.errorParser;
    
    api.createOrUpdate = (req, res) => {
        let mapContent = req.body;
        console.log(mapContent);

        mapContentModel
        .find({"map._id": mapContent.map._id, "version": mapContent.version})
        .then(mapContentFinded => {
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
                        href: app.get('mapContentApiRoute') + mapContent._id
                    };
    
                    mapContentCreated.save();

                    mapModel
                    .findById(mapContent.map._id)
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

    api.getContent = (req, res) => {
        var id = mongoose.Types.ObjectId('5aaad0789c81c107c0dc1abc');
        mapContentModel
            .findById(id)
            .then(content => {
                res.json(content);
            })
    }

    api.findById = (req, res) => {        
        mapContentModel
            .findById(req.params.mapContentId)
            .then(mapContent => res.json(mapContent), error => error => res.status(500).json(errorParser.parse('mapContent-2', error)));
    }

    return api;
}
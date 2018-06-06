module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const debateUnityModel = mongoose.model('DebateUnity');
    const errorParser = app.helpers.errorParser;

    api.create = (req, res) => {
        if(!Array.isArray(req.body)) res.status(400).json(errorParser.parse('debateUnities-1', {}))
        else {
            debateUnityModel
                .create(req.body)
                .then(debateUnities => {
                    debateUnities.forEach(element => {
                        element.link = {
                            rel: 'debateUnity',
                            href: app.get('debateUnityApiRoute') + element._id
                        };

                        element.debate.link = {
                            rel: 'debate',
                            href: app.get('debateApiRoute') + element.initialMapContent._id
                        };

                        element.initialMapContent.link = {
                            rel: 'mapContent',
                            href: app.get('mapContentApiRoute') + element.initialMapContent._id
                        };

                        element.save();
                        
                    }, error => res.status(500).json(errorParser.parse('debateUnities-2', error)));

                    res.status(201).json({
                        userMessage: 'Debate unities created successfully. ',
                        debateUnities 
                    });
                }, error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
        }
    };

    api.update = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('debateUnities-1', {}))
        else {
            debateUnities
                .findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(debateUnity => {
                    if(!debateUnity) res.status(404).json(errorParser.parse('debateUnities-3', {}))
                    else res.json({
                            userMessage: 'The debate unity was updated. ', 
                            alertMessage,    
                            user
                        });
                }, error => {
                    res.status(500).json(errorParser.parse('debateUnities-1', error));    
                });
        }
    };

    api.findById = (req, res) => {
        debateUnityModel
            .findById(req.params.debateUnityId)
            .then(debateUnity => res.json(debateUnity), error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    api.findByQuestioner = (req, res) => {
        var id = new mongoose.Types.ObjectId(req.auth.user._id);

        debateUnityModel
        .find('$or: [{"questioner1._id":' + id + '}, {"questioner2._id":' + id + '}]')
        .then(debateUnities => {
            res.json(debateUnities);
        }, error => res.status(500).json(errorParser.parse('users-1', error)));
    };

    return api;
}
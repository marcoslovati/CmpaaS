module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const debateUnityModel = mongoose.model('DebateUnity');
    const errorParser = app.helpers.errorParser;

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('debateUnities-1', {}))
        else {
            debateUnityModel
                .create(req.body)
                .then(debateUnity => {
                    debateUnity.link = {
                        rel: 'debateUnity',
                        href: app.get('debateUnityApiRoute') + debateUnity._id
                    };
                    debate.save();
                    userModel
                        .findById(req.auth.user._id)
                        .then(user => {
                            user.debates = user.debates || [];
                            user.debates.push(debate);
                            user.save();
                            res.status(201).json({
                                userMessage: 'Debate created successfully. ',
                                debate 
                            });
                        }, error => res.status(500).json(errorParser.parse('users-1', error)));
                }, error => res.status(500).json(errorParser.parse('debates-2', error)));
        }
    };

    api.list = (req, res) => {
        debateModel
            .find({})
            .then(debates => res.json(debates), error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.findByCreator = (req, res) => {
        debateModel
            .find({'creator._id' : req.params.creatorId})
            .then(debates => res.json(debates), error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.findById = (req, res) => {
        debateModel
            .findById(req.params.debateId)
            .then(debates => res.json(debates), error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    return api;
}
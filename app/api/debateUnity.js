module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const debateUnityModel = mongoose.model('DebateUnity');
    const debateModel = mongoose.model('Debate');
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

    api.updateQuestions = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('debateUnities-1', {}))
        else {            
            if(req.auth.user._id !== req.body.debateUnity.questioner1._id &&
                req.auth.user._id !== req.body.debateUnity.questioner2._id){
                    res.status(400).json(errorParser.parse('debateUnities-4', error));
            }
            else{
                let debateUnity = req.body.debateUnity;
                if(req.auth.user._id === req.body.debateUnity.questioner1._id)
                    debateUnity.questionsQuestioner1 = req.body.questions;                
                else
                    debateUnity.questionsQuestioner2 = req.body.questions;

                debateUnityModel
                .findByIdAndUpdate(debateUnity._id, debateUnity, { new: true })
                .then(debateUnity => {
                    if(!debateUnity) res.status(404).json(errorParser.parse('debateUnities-3', {}))
                    else res.json({
                            userMessage: 'The debate unity was updated. ',                                 
                            debateUnity
                        });
                }, error => {
                    res.status(500).json(errorParser.parse('debateUnities-1', error));    
                }); 
            }
        }
    };

    api.update = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('debateUnities-1', {}))
        else {
            debateUnityModel
            .findByIdAndUpdate(req.body._id, req.body, { new: true })
            .then(debateUnity => {
                if(!debateUnity) res.status(404).json(errorParser.parse('debateUnities-2', {}))
                else res.json({
                        userMessage: 'The debate unity was updated. ',                                 
                        debateUnity
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
        let id = new mongoose.Types.ObjectId(req.auth.user._id);

        debateModel
        .find({"active" : true})
        .then(debates => {
            let idsDebate = debates.map(d => d._id);

            debateUnityModel
            .find({$or: [{"questioner1._id": id }, {"questioner2._id": id }], "debate._id":{$in: idsDebate}})
            .then(debateUnities => {
                res.json(debateUnities);
            }, error => res.status(500).json(errorParser.parse('debateUnities-1', error)));
        }, error => res.status(500).json(errorParser.parse('debateUnities-1', error)));
    };

    api.findByAuthor = (req, res) => {
        let id = new mongoose.Types.ObjectId(req.auth.user._id);

        debateModel
        .find({"active" : true})
        .then(debates => {
            let idsDebate = debates.map(d => d._id);

            debateUnityModel
            .find({'mapsAuthor._id': id, "debate._id":{$in: idsDebate}})
            .then(debateUnities => {
                res.json(debateUnities);
            }, error => res.status(500).json(errorParser.parse('debateUnities-1', error)));
        },error => res.status(500).json(errorParser.parse('debateUnities-1', error)));
    };

    api.findByDebate = (req, res) => {
        debateUnityModel
        .find({'debate._id': req.params.debateId})
        .then(debateUnities => {
            res.json(debateUnities);
        }, error => res.status(500).json(errorParser.parse('debateUnities-1', error)));
    };    

    return api;
}
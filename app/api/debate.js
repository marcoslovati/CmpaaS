module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const computeEuclideanDistance = require('compute-euclidean-distance');
    const promise = require("bluebird");
    const userModel = mongoose.model('User');
    const debateModel = mongoose.model('Debate');
    const debateUnityModel = mongoose.model('DebateUnity');
    const mapContentModel = mongoose.model('MapContent');    
    const errorParser = app.helpers.errorParser;

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('debates-1', {}))
        else {
            debateModel
                .create(req.body)
                .then(debate => {
                    debate.link = {
                        rel: 'debate',
                        href: app.get('debateApiRoute') + debate._id
                    };
                    debate.creator = req.auth.user;
                    debate.referenceMapContent.link = {
                        rel: 'mapContent',
                        href: app.get('mapContentApiRoute') + debate.referenceMapContent._id
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

    api.findByCreator = (req, res) => {
        var ObjectId = mongoose.Types.ObjectId;
        debateModel
            .find({ "creator._id": new ObjectId(req.auth.user._id) })
            .then(debates => res.json(debates), error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.findById = (req, res) => {
        debateModel
            .findById(req.params.debateId)
            .then(debates => res.json(debates), error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.findByIdAndProcess = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var initialMapConcepts = [];

        var weightedReference = [];
        var weightedInitial = [];

        console.log("findByIdAndProcess");

        debateModel
            .findById(req.params.debateId)
            .then(debate =>{
                mapContentModel
                .findById(debate.referenceMapContent._id)
                .then(mapContent =>{                    
                    referenceMapConcepts = mapToArray(mapContent);
                    allConcepts = concatDiffer(allConcepts, referenceMapConcepts);

                    debateUnityModel
                    .find({'debate._id' : req.params.debateId})
                    .then(debateUnities => {
                        var p = Promise.resolve();

                        debateUnities.forEach((element) => {
                            p.then(new Promise(function(resolve){
                                mapContentModel
                                .findById(element.initialMapContent._id)
                                .then(mapContent =>{
                                    mapContent.on('end', function() {
                                        console.log("passo");
                                        var mapConcepts = mapToArray(mapContent);
        
                                        initialMapConcepts.push({
                                            "_id":element._id,
                                            "mapConcepts": mapConcepts
                                        });
        
                                        allConcepts = concatDiffer(allConcepts, mapConcepts);

                                        resolve();
                                   });
                                });
                            }));
                        });

                        p.then(function(){
                            console.log("agora sim");
                            weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);

                            initialMapConcepts.forEach(element => {
                                weightedInitial.push({
                                    "_id":element._id,
                                    "mapConcepts": conceptArrayToBoolean(allConcepts, element.mapConcepts)
                                });
                            });
    
                            weightedInitial.forEach(element => {
                                element.distance = computeEuclideanDistance(weightedReference, element.mapConcepts);                            
                                console.log(element.distance);
                            });                                    
    
                            res.json({
                                userMessage: 'Debate processed successfully. ',
                                weightedInitial 
                            });
                        });                        
                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    function mapToArray(map){
        var concepts = [];
        var content = JSON.parse(map.content);
        content.nodeDataArray.forEach(nodeData =>{
            if(!concepts.includes(nodeData.text))
                concepts.push(nodeData.text);
        });
        return concepts;
    }

    function concatDiffer(allItems, newItems){
        newItems.forEach(element =>{
            if(!allItems.includes(element))
                allItems.push(element);
        });
        return allItems;
    }

    function conceptArrayToBoolean(allConcepts, mapConcepts){
        var weightedArray = [];
        allConcepts.forEach(element => {
            if(mapConcepts.includes(element))
                weightedArray.push(1);
            else
                weightedArray.push(0);
        });

        return weightedArray;
    }

    return api;
}
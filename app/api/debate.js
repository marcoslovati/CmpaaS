module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const computeEuclideanDistance = require('compute-euclidean-distance');
    const kmeans = require('node-kmeans');
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

                        debateUnities.forEach((element, i, array) => {
                            p.then(new Promise(function(resolve){
                                mapContentModel
                                .findById(element.initialMapContent._id)
                                .then(mapContent =>{
                                    console.log("passo " + mapContent._id);
                                    var mapConcepts = mapToArray(mapContent);
    
                                    initialMapConcepts.push({
                                        "_id":element._id,
                                        "mapConcepts": mapConcepts
                                    });
    
                                    allConcepts = concatDiffer(allConcepts, mapConcepts);
                                    
                                    resolve();
                                });
                            }).then(function(){
                                if(i === array.length - 1){
                                    console.log("agora sim");
                                    weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);
        
                                    initialMapConcepts.forEach(element => {
                                        weightedInitial.push({
                                            "_id":element._id,
                                            "mapConcepts": conceptArrayToBoolean(allConcepts, element.mapConcepts)
                                        });
                                    });

                                    var distances = [];

                                    weightedInitial.forEach(element => {
                                        element.distance = computeEuclideanDistance(weightedReference, element.mapConcepts);                            
                                        distances.push([0, element.distance]);
                                        console.log(element.distance);
                                    });
                                    
                                    var p3 = Promise.resolve();
                                    // for (let index = 2; index < distances.length; index++) {
                                    var index = 4; // setando 4 clusters, mas teria que escolher pela qualidade da clusterização
                                    p3.then(new Promise(function(resolve){
                                        kmeans.clusterize(distances, {k: index}, (err,resp) => {
                                            if (err) console.error(err);
                                            else {
                                                console.log(resp);

                                                resp.sort(function(a, b){
                                                    if(a.centroid[1] < b.centroid[1])
                                                    return -1;
                                                
                                                    if(a.centroid[1] > b.centroid[1])
                                                        return 1;
                                                        
                                                    return 0;
                                                });

                                                resp.forEach(el,ind => {
                                                    if(ind === 0){
                                                        
                                                    }
                                                });

                                                console.log(resp);
                                                resolve();                                                                                          
                                            }
                                        }); 
                                    }).then(function(){
                                        console.log('resposta');

                                        res.json({
                                            userMessage: 'Debate processed successfully. ',
                                            weightedInitial 
                                        });
                                    }));                                   
                                    // }                          

                                }
                            }));
                        });                       
                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    function comparaClusters(a, b){
        if(a.centroid[1] < b.centroid[1])
            return -1;
        
        if(a.centroid[1] > b.centroid[1])
            return 1;
            
        return 0;
    }

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
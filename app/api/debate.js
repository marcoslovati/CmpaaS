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
    const mapModel = mongoose.model('Map');   
    const errorParser = app.helpers.errorParser;

    var comparaDistancias = function (a, b){
        return a.debateUnity.initialDistance > b.debateUnity.initialDistance;
    }

    var comparaDistanciasReverso = function (a, b){
        return a.distance < b.distance;
    }

    function mapToArray(map){
        var concepts = [];
        var content = JSON.parse(map.content);
        content.nodeDataArray.forEach(nodeData => {
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

    api.findByIdAndProcessLevelsInitial = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var initialMapConcepts = [];

        var weightedReference = [];

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

                                    mapModel
                                    .findById(mapContent.map._id)
                                    .then(map =>{
                                        var mapConcepts = mapToArray(mapContent);
                                        
                                        element.mapsAuthor = map.author;

                                        initialMapConcepts.push({
                                            "debateUnity":element,
                                            "mapConcepts": mapConcepts
                                        });
        
                                        allConcepts = concatDiffer(allConcepts, mapConcepts);
                                        
                                        resolve();
                                    });                                    
                                });
                            }).then(function(){
                                if(i === array.length - 1){
                                    weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);                                    

                                    initialMapConcepts.forEach(element => {                               
                                        element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);
                                        element.debateUnity.initialDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                        element.debateUnity.questioner1 = undefined;
                                        element.debateUnity.questioner2 = undefined;
                                    });

                                    initialMapConcepts.sort(comparaDistancias);                                    

                                    initialMapConcepts.forEach((element, idx, array) => {
                                        if(idx === array.length - 1){
                                            element.debateUnity.questioner1 = array[idx - 1].debateUnity.mapsAuthor;
                                            element.debateUnity.questioner2 = array[idx - 2].debateUnity.mapsAuthor;
                                        }else if(idx === array.length - 2){
                                            element.debateUnity.questioner1 = array[idx + 1].debateUnity.mapsAuthor;
                                            element.debateUnity.questioner2 = array[idx - 2].debateUnity.mapsAuthor;
                                        }else if(idx === 0){
                                            element.debateUnity.questioner1 = array[1].debateUnity.mapsAuthor;
                                            element.debateUnity.questioner2 = array[2].debateUnity.mapsAuthor;
                                        }else if(idx === 1){
                                            element.debateUnity.questioner1 = array[0].debateUnity.mapsAuthor;
                                            element.debateUnity.questioner2 = array[3].debateUnity.mapsAuthor;
                                        }else{
                                            element.debateUnity.questioner1 = array[idx + 2].debateUnity.mapsAuthor;
                                            element.debateUnity.questioner2 = array[idx - 2].debateUnity.mapsAuthor;
                                        }
                                    });

                                    console.log(initialMapConcepts);

                                    var p2 = Promise.resolve();

                                    var updatedDebateUnities = [];

                                    initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                        p2.then(new Promise(function(resolve2){
                                            debateUnityModel
                                            .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                            .then(updatedDebateUnity => {
                                                updatedDebateUnities.push(updatedDebateUnity);

                                                resolve2();
                                            });
                                        }).then(function(){
                                            if(ind === arrayInitial.length - 1){
                                                console.log('resposta');

                                                res.json({
                                                    userMessage: 'Debate processed successfully. ',
                                                    updatedDebateUnities 
                                                });
                                            }
                                        }));
                                    });
                                }
                            }));
                        });                       
                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    api.findByIdAndProcessFinal = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var finalMapConcepts = [];

        var weightedReference = [];

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
                                .findById(element.finalMapContent._id)
                                .then(mapContent =>{

                                    mapModel
                                    .findById(mapContent.map._id)
                                    .then(map =>{
                                        var mapConcepts = mapToArray(mapContent);
                                        
                                        element.mapsAuthor = map.author;

                                        finalMapConcepts.push({
                                            "debateUnity":element,
                                            "mapConcepts": mapConcepts
                                        });
        
                                        allConcepts = concatDiffer(allConcepts, mapConcepts);
                                        
                                        resolve();
                                    });                                    
                                });
                            }).then(function(){
                                if(i === array.length - 1){
                                    weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);                                    

                                    finalMapConcepts.forEach(element => {                               
                                        element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);
                                        element.debateUnity.finalDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                    });

                                    var p2 = Promise.resolve();

                                    var updatedDebateUnities = [];

                                    finalMapConcepts.forEach((element, ind, arrayFinal) => {
                                        p2.then(new Promise(function(resolve2){
                                            debateUnityModel
                                            .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                            .then(updatedDebateUnity => {
                                                updatedDebateUnities.push(updatedDebateUnity);

                                                resolve2();
                                            });
                                        }).then(function(){
                                            if(ind === arrayFinal.length - 1){
                                                console.log('resposta');

                                                res.json({
                                                    userMessage: 'Debate processed successfully. ',
                                                    updatedDebateUnities 
                                                });
                                            }
                                        }));
                                    }); 
                                }
                            }));
                        });                       
                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };
    
    api.findByIdAndProcessClustersInitial = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var initialMapConcepts = [];
        var booleanArrays = [];
        var weightedReference = [];

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

                                mapModel
                                .findById(mapContent.map._id)
                                .then(map =>{
                                    var mapConcepts = mapToArray(mapContent);
                                    
                                    element.mapsAuthor = map.author;

                                    initialMapConcepts.push({
                                        "debateUnity":element,
                                        "mapConcepts": mapConcepts
                                    });
    
                                    allConcepts = concatDiffer(allConcepts, mapConcepts);                                    
                                    resolve();
                                });                                    
                            });
                        }).then(function(){
                            if(i === array.length - 1){
                                weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);

                                initialMapConcepts.forEach(element => {
                                    element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);                               
                                    booleanArrays.push(element.booleanArray);                               
                                    element.debateUnity.initialDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                    element.debateUnity.questioner1 = undefined;
                                    element.debateUnity.questioner2 = undefined;
                                });

                                initialMapConcepts.sort(comparaDistancias);
                                initialMapConcepts.reverse();

                                initialMapConcepts.forEach((element, i, arr) => {                                    
                                    element.distances = [];                               
                                    let filtArray = arr.filter(value => { return value.debateUnity._id != element.debateUnity._id});
                                    filtArray.forEach(elem => {                                        
                                        element.distances.push({debateUnity:elem.debateUnity, distance:computeEuclideanDistance(element.booleanArray, elem.booleanArray)});                                        
                                    });

                                    element.distances.sort(comparaDistanciasReverso);
                                });

                                let arrCont = [];

                                initialMapConcepts.forEach((element) => {
                                    let distances = element.distances; 
                                    let i = 0;

                                    while((element.debateUnity.questioner1._id == undefined || element.debateUnity.questioner2._id == undefined) && i < distances.length){
                                        
                                        let author = distances[i].debateUnity.mapsAuthor;
                                        let quest = initialMapConcepts.find(el => {return el.debateUnity.mapsAuthor._id == author._id});

                                        if((quest.debateUnity.questioner1._id == undefined || !quest.debateUnity.questioner1._id.equals(element.debateUnity.mapsAuthor._id)) &&
                                            (quest.debateUnity.questioner2._id == undefined || !quest.debateUnity.questioner2._id.equals(element.debateUnity.mapsAuthor._id))){
                                            let count = arrCont.find(el => { return author._id == el.id });

                                            if(count == undefined){
                                                count = {id: author._id, count: 0}
                                                arrCont.push(count);
                                            }

                                            if(count.count < 2){                                                
                                                if(element.debateUnity.questioner1._id == undefined)
                                                    element.debateUnity.questioner1 = author;
                                                else if(element.debateUnity.questioner2._id == undefined)
                                                    element.debateUnity.questioner2 = author;

                                                count.count = count.count + 1;
                                            }
                                        }                                        
                                        i++;                                        
                                    }                                
                                });

                                var p2 = Promise.resolve();

                                var updatedDebateUnities = [];

                                initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                    p2.then(new Promise(function(resolve2){
                                        debateUnityModel
                                        .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                        .then(updatedDebateUnity => {
                                            updatedDebateUnities.push(updatedDebateUnity);

                                            resolve2();
                                        });
                                    }).then(function(){
                                        if(ind === arrayInitial.length - 1){
                                            console.log('resposta');

                                            res.json({
                                                userMessage: 'Debate processed successfully. ',
                                                updatedDebateUnities 
                                            });
                                        }
                                    }));
                                });
                            }
                        }));
                    });                       
                });
            });
        },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    return api;
}
module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const computeEuclideanDistance = require('compute-euclidean-distance');
    const kmeans = require('node-kmeans');
    const promise = require("bluebird");
    const pythonShell = require("python-shell");
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

    let mapToArray = function (map){
        return new Promise(function(success, nosuccess) {
            let content = JSON.parse(map.content);
            let concepts = [];

            content.nodeDataArray.forEach(elem =>
                concepts.push(elem.text)
            );

            let pathFolders = __dirname.split('/');
            let path = "";

            pathFolders.forEach((dir, i) => {
                if(i < pathFolders.length - 1){
                    path += dir + '/';
                }
            });

            let options = {
                pythonPath: path + 'plnpython/env/bin/python3',
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: path + 'plnpython',
                args: [concepts]
            };        
        
            pythonShell.run('lemmasfromconcept.py', options, function (err, data) {
                if (err) console.log(err);
                else{
                    success(data[0].split(','));
                }             
            }); 
        });               
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

    api.updatePhaseToAnswer = (req, res) => {
        debateModel
        .findById(req.params.debateId)
        .then(debate => {
            debate.phase = "R";

            debateModel
            .findByIdAndUpdate(req.params.debateId, debate, { new: true })
            .then(updatedDebate => {
                debateUnityModel
                .find({'debate._id' : updatedDebate._id})
                .then(debateUnities => {                        
                    debateUnities.forEach(element => {
                        element.debate.phase = "R";

                        debateUnityModel
                        .findByIdAndUpdate(element._id, element, { new: true })
                        .then(updatedDebateUnity => {
                            // console.log("alterado");                            
                        });
                    });
                });

                res.json({
                    userMessage: 'Debate updated successfully.',
                    debate 
                });
            });
        }, error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.findByIdAndProcessLevelsInitial = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var initialMapConcepts = [];

        var weightedReference = [];

        console.log("findByIdAndProcessLevelsInitial");

        debateModel
        .findById(req.params.debateId)
        .then(debate =>{
            mapContentModel
            .findById(debate.referenceMapContent._id)
            .then(mapContent =>{    
                
                mapToArray(mapContent)
                .then(function(fromRunpy) {
                    // console.log(fromRunpy);
                    referenceMapConcepts = fromRunpy;
                    allConcepts = concatDiffer(allConcepts, referenceMapConcepts);

                    debateUnityModel
                    .find({'debate._id' : req.params.debateId})
                    .then(debateUnities => {
                        let promises = [];

                        debateUnities.forEach((element, i, array) => {
                            promises.push(
                                new Promise(function(resolve, reject){
                                    mapContentModel
                                    .findById(element.initialMapContent._id)
                                    .then(mapContent =>{
                                        mapModel
                                        .findById(mapContent.map._id)
                                        .then(map =>{
                                            mapToArray(mapContent)
                                            .then(function(fromRunpy2) {
                                                mapConcepts = fromRunpy2;                                             
                                            
                                                element.mapsAuthor = map.author;

                                                initialMapConcepts.push({
                                                    "debateUnity": element,
                                                    "mapConcepts": mapConcepts
                                                });
                
                                                allConcepts = concatDiffer(allConcepts, mapConcepts);
                                                resolve();
                                            });
                                        });
                                    })
                                })
                            );
                        });

                        Promise.all(promises).then(() => {                               
                            
                            weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);                                    

                            initialMapConcepts.forEach(element => {                               
                                element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);
                                element.debateUnity.initialDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                element.debateUnity.question1 = null;
                                element.debateUnity.question2 = null;
                                element.debateUnity.question3 = null;
                                element.debateUnity.question4 = null;
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

                            let promises2 = [];

                            var updatedDebateUnities = [];

                            initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                promises2.push(
                                    new Promise(function(resolve, reject){
                                        element.debateUnity.debate.phase = "P";

                                        debateUnityModel
                                        .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                        .then(updatedDebateUnity => {
                                            updatedDebateUnities.push(updatedDebateUnity);
                                            resolve();
                                        })
                                    })
                                );
                            });

                            Promise.all(promises2).then(() => {
                                debate.phase = "P";

                                debateModel
                                .findByIdAndUpdate(req.params.debateId, debate, { new: true })
                                .then(updatedDebate => {
                                    console.log('resposta');

                                    res.json({
                                        userMessage: 'Debate processed successfully. ',
                                        updatedDebateUnities 
                                    });
                                });
                            });
                        });
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

        console.log("findByIdAndProcessFinal");

        debateModel
        .findById(req.params.debateId)
        .then(debate =>{
            mapContentModel
            .findById(debate.referenceMapContent._id)
            .then(mapContent =>{

                mapToArray(mapContent)
                .then(function(fromRunpy) {
                    // console.log(fromRunpy);
                    referenceMapConcepts = fromRunpy;
                    allConcepts = concatDiffer(allConcepts, referenceMapConcepts);

                    debateUnityModel
                    .find({'debate._id' : req.params.debateId})
                    .then(debateUnities => {

                        let promises = [];

                        debateUnities.forEach((element, i, array) => {
                            promises.push(
                                new Promise(function(resolve, reject){
                                    mapContentModel
                                    .findById(element.finalMapContent._id)
                                    .then(mapContent =>{

                                        mapModel
                                        .findById(mapContent.map._id)
                                        .then(map =>{

                                            mapToArray(mapContent)
                                            .then(function(fromRunpy2) {
                                                mapConcepts = fromRunpy2;  
                                            
                                                element.mapsAuthor = map.author;

                                                finalMapConcepts.push({
                                                    "debateUnity":element,
                                                    "mapConcepts": mapConcepts
                                                });
                
                                                allConcepts = concatDiffer(allConcepts, mapConcepts);
                                                
                                                resolve();
                                            });
                                        });                                    
                                    });
                                })
                            );
                        }); 

                        Promise.all(promises).then(()=>{                           
                            weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);                                    

                            finalMapConcepts.forEach(element => {                               
                                element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);
                                element.debateUnity.finalDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                            });

                            let promises2 = [];

                            var updatedDebateUnities = [];

                            finalMapConcepts.forEach((element, ind, arrayFinal) => {
                                promises2.push(
                                    new Promise(function(resolve, reject){
                                        element.debateUnity.debate.phase = "C";

                                        debateUnityModel
                                        .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                        .then(updatedDebateUnity => {
                                            updatedDebateUnities.push(updatedDebateUnity);
                                            resolve();
                                        });
                                    })
                                );
                            });

                            Promise.all(promises2).then(() => {
                                debate.phase = "C";

                                debateModel
                                .findByIdAndUpdate(req.params.debateId, debate, { new: true })
                                .then(updatedDebate => {
                                    console.log('resposta');

                                    res.json({
                                        userMessage: 'Debate processed successfully. ',
                                        updatedDebateUnities 
                                    });
                                });
                            });
                        });                                              
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

        console.log('findByIdAndProcessClustersInitial');

        debateModel
        .findById(req.params.debateId)
        .then(debate =>{
            mapContentModel
            .findById(debate.referenceMapContent._id)
            .then(mapContent =>{   

                mapToArray(mapContent)
                .then(function(fromRunpy) {
                    allConcepts = concatDiffer(allConcepts, referenceMapConcepts);

                    debateUnityModel
                    .find({'debate._id' : req.params.debateId})
                    .then(debateUnities => {

                        let promises = [];

                        debateUnities.forEach((element, i, array) => {
                            promises.push(
                                new Promise(function(resolve, reject){
                                    mapContentModel
                                    .findById(element.initialMapContent._id)
                                    .then(mapContent =>{                                        
                                        mapModel
                                        .findById(mapContent.map._id)
                                        .then(map =>{
                                            mapToArray(mapContent)
                                            .then(function(fromRunpy2) {
                                                mapConcepts = fromRunpy2;  
                                                element.mapsAuthor = map.author;

                                                initialMapConcepts.push({
                                                    "debateUnity":element,
                                                    "mapConcepts": mapConcepts
                                                });
                
                                                allConcepts = concatDiffer(allConcepts, mapConcepts);                                    
                                                resolve();
                                            });
                                        });                                    
                                    });
                                })
                            );
                        });

                        Promise.all(promises).then(() => {

                            weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);

                            initialMapConcepts.forEach(element => {
                                element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);                               
                                booleanArrays.push(element.booleanArray);                               
                                element.debateUnity.initialDistance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                element.debateUnity.questioner1 = null;
                                element.debateUnity.questioner2 = null;
                                element.debateUnity.question1 = null;
                                element.debateUnity.question2 = null;
                                element.debateUnity.question3 = null;
                                element.debateUnity.question4 = null;
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

                            // console.log("1----------------");
                            initialMapConcepts.forEach((element, index) => {
                                let distances = element.distances; 
                                let i = 0;

                                while(element.debateUnity.questioner1._id == undefined && i < distances.length){
                                    let author = distances[i].debateUnity.mapsAuthor;
                                    let quest = initialMapConcepts.find(el => {return el.debateUnity.mapsAuthor._id == author._id});

                                    let count = arrCont.find(el => { return author._id == el.id });

                                    if(count == undefined){
                                        count = {id: author._id, count: 0}
                                        arrCont.push(count);
                                    }

                                    if(count.count == 0 && (quest.debateUnity.questioner1._id == undefined || 
                                                            (!quest.debateUnity.questioner1._id.equals(element.debateUnity.mapsAuthor._id) || index == initialMapConcepts.length - 1))){
                                        element.debateUnity.questioner1 = author;
                                        count.count = count.count + 1;
                                        element.distances.splice(i, 1);
                                    }
                                        
                                    i++;
                                }                                
                            });

                            // console.log("2----------------");
                            initialMapConcepts.forEach((element, index) => {
                                let distances = element.distances; 
                                let i = 0;

                                while(element.debateUnity.questioner2._id == undefined && i < distances.length){
                                    // console.log('while: ' + distances[i].debateUnity.mapsAuthor.username);
                                    let author = distances[i].debateUnity.mapsAuthor;
                                    let quest = initialMapConcepts.find(el => {return el.debateUnity.mapsAuthor._id == author._id});

                                    let count = arrCont.find(el => { return author._id == el.id });

                                    if(count.count == 1 && (quest.debateUnity.questioner2._id == undefined || 
                                                            (!quest.debateUnity.questioner2._id.equals(element.debateUnity.mapsAuthor._id)|| index == initialMapConcepts.length - 1))){
                                        element.debateUnity.questioner2 = author;
                                        count.count = count.count + 1;
                                    }

                                    i++;
                                }                             
                            });

                            let promises2 = [];
                            var updatedDebateUnities = [];

                            initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                promises2.push(
                                    new Promise(function(resolve, reject){
                                        element.debateUnity.debate.phase = "P";

                                        debateUnityModel
                                        .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                        .then(updatedDebateUnity => {
                                            updatedDebateUnities.push(updatedDebateUnity);
                                            resolve();
                                        });
                                    })
                                );
                            });
                            // console.log('-----------');
                            Promise.all(promises2).then(() => {
                                debate.phase = "P";

                                debateModel
                                .findByIdAndUpdate(req.params.debateId, debate, { new: true })
                                .then(updatedDebate => {
                                    console.log('resposta');

                                    res.json({
                                        userMessage: 'Debate processed successfully. ',
                                        updatedDebateUnities 
                                    });
                                });
                            });
                        });                       
                    });
                });
            });
        },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    return api;
}
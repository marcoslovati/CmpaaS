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

    // var comparaClusters = function (a, b){
    //     if(a.centroid[1] < b.centroid[1])
    //         return -1;
        
    //     if(a.centroid[1] > b.centroid[1])
    //         return 1;
            
    //     return 0;
    // }

    var comparaDistancias = function (a, b){
        return a.distance < b.distance;
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
    
                                        initialMapConcepts.push({
                                            "debateUnity":element,
                                            // "mapContent":mapContent,
                                            "mapConcepts": mapConcepts,
                                            "author":map.author
                                        });
        
                                        allConcepts = concatDiffer(allConcepts, mapConcepts);
                                        
                                        resolve();
                                    });                                    
                                });
                            }).then(function(){
                                if(i === array.length - 1){
                                    console.log("agora sim");
                                    weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);                                    

                                    initialMapConcepts.forEach(element => {                               
                                        element.booleanArray = conceptArrayToBoolean(allConcepts, element.mapConcepts);
                                        element.distance = computeEuclideanDistance(weightedReference, element.booleanArray);
                                    });

                                    initialMapConcepts.sort(comparaDistancias);                                    

                                    initialMapConcepts.forEach((element, idx, array) => {
                                        if(idx === array.length - 1){
                                            element.debateUnity.questioner1 = { 
                                                "_id": array[idx - 1].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx - 1].author._id,
                                                    "href": "user"
                                                }
                                            };

                                            element.debateUnity.questioner2 = { 
                                                "_id": array[idx - 2].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx - 2].author._id,
                                                    "href": "user"
                                                }
                                            };
                                        }else if(idx === array.length - 2){
                                            element.debateUnity.questioner1 = { 
                                                "_id": array[idx + 1].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx + 1].author._id,
                                                    "href": "user"
                                                }
                                            };

                                            element.debateUnity.questioner2 = { 
                                                "_id": array[idx - 2].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx - 2].author._id,
                                                    "href": "user"
                                                }
                                            };
                                        }else if(idx === 0){
                                            element.debateUnity.questioner1 = { 
                                                "_id": array[1].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[1].author._id,
                                                    "href": "user"
                                                }
                                            };

                                            element.debateUnity.questioner2 = { 
                                                "_id": array[2].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[2].author._id,
                                                    "href": "user"
                                                }
                                            };
                                        }else if(idx === 1){
                                            element.debateUnity.questioner1 = { 
                                                "_id": array[0].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[0].author._id,
                                                    "href": "user"
                                                }
                                            };

                                            element.debateUnity.questioner2 = { 
                                                "_id": array[3].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[3].author._id,
                                                    "href": "user"
                                                }
                                            };
                                        }else{
                                            element.debateUnity.questioner1 = { 
                                                "_id": array[idx + 2].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx + 2].author._id,
                                                    "href": "user"
                                                }
                                            };

                                            element.debateUnity.questioner2 = { 
                                                "_id": array[idx - 2].author._id,
                                                "link":{
                                                    "rel": app.get('userApiRoute') + array[idx - 2].author._id,
                                                    "href": "user"
                                                }
                                            };
                                        }
                                    });

                                    // console.log(initialMapConcepts);

                                    var p2 = Promise.resolve();

                                    initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                        p2.then(new Promise(function(resolve2){
                                            debateUnityModel
                                            .findByIdAndUpdate(element.debateUnity._id, element.debateUnity, { new: true })
                                            .then(updatedDebateUnity => {
                                                console.log(updatedDebateUnity);

                                                resolve2();
                                            });
                                        }).then(function(){
                                            if(ind === arrayInitial.length - 1){
                                                console.log('resposta');

                                                res.json({
                                                    userMessage: 'Debate processed successfully. ',
                                                    initialMapConcepts 
                                                });
                                            }
                                        }));
                                    });                                    
                                    
                                    // var p3 = Promise.resolve();
                                    // for (let index = 2; index < distances.length; index++) {
                                    // var index = 4; // setando 4 clusters, mas teria que escolher pela qualidade da clusterização
                                    // p3.then(new Promise(function(resolve){
                                    //     kmeans.clusterize(distances, {k: index}, (err,resp) => {
                                    //         if (err) console.error(err);
                                    //         else {
                                    //             console.log(resp);

                                    //             resp.sort(comparaClusters);

                                    //             resp.forEach(el,ind => {
                                    //                 if(ind === 0){
                                    //                     var clusterMapConcepts = [];
                                    //                     el.clusterInd.forEach(element => {
                                    //                         clusterMapConcepts.push(weightedInitial[ind].mapConcepts);
                                    //                     });

                                    //                     // setando 2 clusters, mas teria que escolher pela qualidade da clusterização
                                    //                     kmeans.clusterize(clusterMapConcepts, {k: 2}, (err,resp) => {
                                    //                         if (err) console.error(err);
                                    //                         else {
                                                                
                                    //                         }
                                    //                     });
                                    //                 }
                                    //             });

                                    //             console.log(resp);
                                    //             resolve();                                                                                          
                                    //         }
                                    //     }); 
                                    // }).then(function(){                                        
                                    // }));                                   
                                    // }                          

                                }
                            }));
                        });                       
                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    return api;
}
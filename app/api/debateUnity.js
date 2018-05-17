module.exports = app => {
    const mongoose = require('mongoose');
    const computeEuclideanDistance = require('compute-euclidean-distance');
    const api = {};
    const debateUnityModel = mongoose.model('DebateUnity');
    const debateModel = mongoose.model('Debate');
    const mapContentModel = mongoose.model('MapContent');
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

    api.findByDebateAndProcess = (req, res) => {
        var allConcepts = [];
        var referenceMapConcepts = [];
        var initialMapConcepts = [];

        var weightedReference = [];
        var weightedInitial = [];

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
                        debateUnities.forEach(element => {
                            mapContentModel
                            .findById(element.initialMapContent._id)
                            .then(mapContent =>{
                                var mapConcepts = mapToArray(mapContent);

                                initialMapConcepts.push({
                                    "_id":element._id,
                                    "mapConcepts": mapConcepts
                                });
                                allConcepts = concatDiffer(allConcepts, mapConcepts);
                            });
                        });

                        weightedReference = conceptArrayToBoolean(allConcepts, referenceMapConcepts);

                        initialMapConcepts.forEach(element => {
                            weightedInitial.push({
                                "_id":element._id,
                                "mapConcepts": conceptArrayToBoolean(allConcepts, element.mapConcepts)
                            });
                        });

                        weightedInitial.forEach(element => {
                            element.distance = computeEuclideanDistance.euclidean(weightedReference, element.mapConcepts);                            
                            console.log(element.distance);
                        });                       

                    });
                });
            },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    api.findById = (req, res) => {
        debateUnityModel
            .findById(req.params.debateUnityId)
            .then(debateUnity => res.json(debateUnity), error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    return api;

    function mapToArray(map){
        var concepts = [];
        map.content.nodeDataArray.forEach(nodeData =>{
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
}
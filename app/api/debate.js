module.exports = app => {
    const mongoose = require('mongoose');
    const api = {};
    const computeEuclideanDistance = require('compute-euclidean-distance');
    const kmeans = require('node-kmeans');
    const promise = require("bluebird");
    const pythonShell = require("python-shell");
    const language = require('@google-cloud/language');
    const userModel = mongoose.model('User');
    const debateModel = mongoose.model('Debate');
    const debateUnityModel = mongoose.model('DebateUnity');
    const mapContentModel = mongoose.model('MapContent');
    const mapModel = mongoose.model('Map');   
    const errorParser = app.helpers.errorParser;

    let comparaDistancias = function (a, b){
        return a.debateUnity.initialDistance > b.debateUnity.initialDistance;
    }

    let comparaDistanciasReverso = function (a, b){
        return a.distance < b.distance;
    }

    let mapToArray = function (map){
        return new Promise(function(success, nosuccess) {
            let content = JSON.parse(map.content);
            let ngrams = [];

            let nodes = content.nodeDataArray;
            let links = content.linkDataArray;

            const client = new language.LanguageServiceClient();

            const document = {
                content: "",
                type: 'PLAIN_TEXT',
                language: 'PT'
              };

            let completeText = "";

            nodes.forEach(elem=>{
                if(elem.category === 'concept')
                    completeText += elem.text + ', ';                
            });

            let propositions = [];
            let conceptConcepts = [];

            links.forEach(elem=>{
                let id1 = elem.from;
                let id2 = elem.to;
                let node1 = nodes.find(e => e.key === id1);
                let node2 = nodes.find(e => e.key === id2);

                let proposition = "";
                let conceptConcept = "";

                if(node1.category === "concept" && node2.category === "relation"){
                    let elem2 = links.find(e => e.from === node2.key);
                    let concept2 = nodes.find(e => e.key === elem2.to);
                    proposition = node1.text + " " + node2.text + " " + concept2.text;
                    conceptConcept = node1.text + " " + concept2.text;
                }
                else if(node1.category === "relation" && node2.category === "concept"){
                    let elem2 = links.find(e => e.to === node1.key);
                    let concept1 = nodes.find(e => e.key === elem2.from);
                    proposition = concept1.text + " " + node1.text + " " + node2.text;
                    conceptConcept = concept1.text + " " + node2.text;
                }

                propositions.push(proposition);
                conceptConcepts.push(conceptConcept);
            });

            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }

            propositions = propositions.filter(onlyUnique);
            conceptConcepts = conceptConcepts.filter(onlyUnique);

            completeText += propositions.join(', ');
            completeText += ', ' + conceptConcepts.join(', ') + ',';

            document.content = completeText.toLowerCase();

            client
            .analyzeSyntax({document: document})
            .then(results => {
                const syntax = results[0];                
                  
                let ngram = "";
                syntax.tokens.forEach(part => {
                    if(part.partOfSpeech.tag === 'NOUN' ||
                       part.partOfSpeech.tag === 'ADJ' ||
                       part.partOfSpeech.tag === 'VERB' ||
                       part.partOfSpeech.tag === 'ADV' && part.dependencyEdge.label === 'NEG'){
                        ngram += " " + part.lemma;
                    }
                    else if(part.partOfSpeech.tag === 'PUNCT'){
                        ngrams.push(ngram.substring(1));
                        ngram = "";
                    } 
                }); 
                
                console.log(ngrams);
                success(ngrams);             
            })
            .catch(err => {
                console.error('ERROR:', err);
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

    api.updateStatus = (req, res) => {
        debateModel
        .findById(req.params.debateId)
        .then(debate => {
            debate.active = !debate.active;

            debateModel
            .findByIdAndUpdate(req.params.debateId, debate, { new: true })
            .then(updatedDebate => {
                res.json(debate);
            });
        }, error => error => res.status(500).json(errorParser.parse('debates-2', error)));
    };

    api.updateAnonymous = (req, res) => {
        debateModel
        .findById(req.params.debateId)
        .then(debate => {
            let anon = !debate.keepAuthorsAnonymous;
            debate.keepAuthorsAnonymous = anon;

            debateModel
            .findByIdAndUpdate(req.params.debateId, debate, { new: true })
            .then(updatedDebate => {

                debateUnityModel
                .find({'debate._id':req.params.debateId})
                .then(debateUnities => {
                    debateUnities.forEach(du => {
                        du.debate.keepAuthorsAnonymous = anon;

                        debateUnityModel
                        .findByIdAndUpdate(du._id, du)
                        .then(duUp =>{
                            console.log(duUp);
                        });
                    });

                    res.json(updatedDebate);
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
                                element.debateUnity.questioner1 = null;
                                element.debateUnity.questioner2 = null;
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

                                        if(mapContent){
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
                                        }
                                        else{
                                            res.status(500).json(errorParser.parse('debateUnities-2', {}));
                                            resolve();
                                        }                                  
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

                            // while(noQuestioner2){
                                // console.log("2----------------");
                            let noQuestioner2 = false;

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
                                
                                noQuestioner2 = element.debateUnity.questioner2._id == undefined;                                   
                            });
                            
                            if(noQuestioner2){
                                res.status(500).json(errorParser.parse('debates-2', {}));
                            }
                            else{

                                let promises2 = [];
                                var updatedDebateUnities = [];

                                initialMapConcepts.forEach((element, ind, arrayInitial) => {
                                    promises2.push(
                                        new Promise(function(resolve, reject){

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
                            }
                        });                      
                    });
                });
            });
        },error => error => res.status(500).json(errorParser.parse('debateUnities-2', error)));
    };

    return api;
}
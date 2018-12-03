module.exports = app => {

    const mongoose = require('mongoose');
    const api = {};
    const activityModel = mongoose.model('Activity');
    const errorParser = app.helpers.errorParser;

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('activities-1', {}))
        else {
            let activity = req.body;
            activity.creator = {
                _id: req.auth.user._id,
                username: req.auth.user.username,
                link: {
                    rel: 'User',
                    href: app.get('userApiRoute') + req.auth.user._id
                }
            };

            activityModel
                .create(req.body)
                .then(activity => {
                    activity.link = {
                        rel: 'self',
                        href: app.get('activityApiRoute') + activity._id
                    };

                    res.status(201).json({
                        userMessage: 'Activity created successfully. ',
                        alertMessage,
                        activity 
                    });
                }, error => {
                    if(error.name == 'ValidationError') res.status(400).json(errorParser.parse('activities-2', error))
                    else res.status(500).json(errorParser.parse('activities-3', error));
                });
        }
    };

    api.findByName = (req, res) => {
        activityModel
            .find({name: new RegExp(req.params.name, "i"), 'creator._id': req.params.creatorId})
            .then(activities => {
                if(!activities) res.status(404).json(errorParser.parse('activities-1', {}))
                else res.json(activities);
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('activities-2', error))
                else res.status(500).json(errorParser.parse('activities-3', error)); 
            });
    };

    api.findById = (req, res) => {
        activityModel
            .findById(req.params.id)
            .then(activity => {
                if(!activity) res.status(404).json(errorParser.parse('activities-1', {}));
                else res.json(activity);
            }, error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('activities-2', error));
                    else res.status(500).json(errorParser.parse('activities-3', error));
            });
    };

    api.findByCreator = (req, res) => {
        activityModel
            .find({'creator._id': req.params.creatorId})
            .then(activities => {
                if(!activities) res.status(404).json(errorParser.parse('activities-1', {}));
                else res.json(activities);
            }, error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('activities-2', error));
                    else res.status(500).json(errorParser.parse('activities-3', error));
            });
    };

    api.update = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('activities-1', {}))
        else {
            activityModel
                .findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(activity => {
                    if(!activity) res.status(404).json(errorParser.parse('activities-1', {}))
                    else res.json({
                            userMessage: 'The activity was updated successfully.',
                            alertMessage,
                            activity
                        });
                }, error => {
                        if(error.name == "CastError")res.status(400).json(errorParser.parse('activities-2', error))
                        else res.status(500).json(errorParser.parse('activities-3', error));
                });
        }
    };

    return api;
}
module.exports = app => {

    const mongoose = require('mongoose');
    const api = {};
    const userModel = mongoose.model('User');
    const groupModel = mongoose.model('Group');
    const errorParser = app.helpers.errorParser;

    let orderByName = function (a, b){
        return a.name > b.name;
    }

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('groups-8', {}))
        else {
            let alertMessage = '';
            if(req.body.users){
                req.body.users = [];
                alertMessage = 'This resource can`t be used to include users on groups. Use the available resources in the users and groups APIs to join or leave groups.';
            }
            let group = req.body;
            console.log(req.auth);
            group.admin = {
                _id: req.auth.user._id,
                username: req.auth.user.username,
                link: {
                    rel: 'User',
                    href: app.get('userApiRoute') + req.auth.user._id
                }
            };

            groupModel
                .create(req.body)
                .then(group => {
                    group.link = { //add link to allow HATEOAS
                        rel: 'self',
                        href: app.get('groupApiRoute') + group._id
                    };

                    res.status(201).json({
                        userMessage: 'Group created successfully. ',
                        alertMessage,
                        group 
                    });
                }, error => {
                    if(error.name == 'ValidationError') res.status(400).json(errorParser.parse('groups-4', error))
                    else if(error.errmsg.includes("E11000")) res.status(400).json(errorParser.parse('groups-5', error));
                    else res.status(500).json(errorParser.parse('groups-3', error));
                });
        }
    };

    api.findByFilter = (req, res) => {
        groupModel
            .find({name: new RegExp(req.params.filter, "i")})
            .then(groups => {
                if(!groups) res.status(404).json(errorParser.parse('groups-7', {}))
                else res.json(groups);
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-5', error))
                else res.status(500).json(errorParser.parse('groups-1', error)); 
            });
    };

    api.list = (req, res) => {
        groupModel
            .find({})
            .then(groups => res.json(groups), error => res.status(500).json(errorParser.parse('groups-3', error)));
    };

    api.bulkUpdate = (req, res) => {
        var arr = req.body;
        if(!Array.isArray(arr)) res.status(400).json(errorParser.parse('groups-6', {}))
        else {
            let alertMessage = ''; //if user try to update groupList, this is used for sending faillure message.
            var bulk = [];
            arr.forEach(group => {
                var keys = Object.keys(group);
                var groupUpdate = {};
                groupUpdate.updateOne = {};
                groupUpdate.updateOne.filter = { _id: group._id };
                groupUpdate.updateOne.update = {};
                keys.forEach(key => {
                    //we are not allowing the userlist update with this resource. (future changes)
                    if(key == 'users') alertMessage = 'This resource can`t be used to make changes to the users list. Use the available resources in the users and groups APIs to join or leave groups.'
                    else if(key != '_id') groupUpdate.updateOne.update[key] = group[key];
                })
                bulk.push(groupUpdate);
            });
            groupModel
                .bulkWrite(bulk)
                .then(result => res.json({
                                    userMessage: result.nModified + ' of ' + result.nMatched + ' groups sended was uptaded successfully.',
                                    alertMessage,
                                    devMessage: result
                                }), 
                error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-2', error))
                    else res.status(500).json(errorParser.parse('groups-3', error));
                });
        }

    };

    api.removeAll = (req, res) => {
        userModel
            .update({}, { groups: [] }, { multi: true })
            .then(() => 
                groupModel
                    .remove({})
                    .then(() => res.sendStatus(204), error => res.status(500).json(errorParser.parse('groups-3', error))),
            error => res.status(500).json(errorParser.parse('users-1', error)));
    };

    api.notAllowed = (req, res) => {
        res.status(405).json(errorParser.parse('groups-7', {}));
    };

    api.findByActivity = (req, res) => {
        groupModel
            .find({ "activities._id": req.params.activityId})
            .then(groups => {
                if(!groups) res.status(404).json(errorParser.parse('groups-7', {}))
                else res.json(groups.sort(orderByName));
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-5', error))
                else res.status(500).json(errorParser.parse('groups-1', error)); 
            });
    };     

    api.findById = (req, res) => {
        groupModel
            .findById(req.params.id)
            .then(group => {
                if(!group) res.status(404).json(errorParser.parse('groups-1', {}));
                else res.json(group);
            }, error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-2', error));
                    else res.status(500).json(errorParser.parse('groups-3', error));
            });
    };

    api.findByAdmin = (req, res) => {
        groupModel
            .find({'admin._id': req.params.adminId})
            .then(groups => {
                if(!groups) res.status(404).json(errorParser.parse('groups-1', {}));
                else res.json(groups);
            }, error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-2', error));
                    else res.status(500).json(errorParser.parse('groups-3', error));
            });
    };

    api.update = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('groups-8', {}))
        else {
            let alertMessage = '';
            if(req.body.users){
                req.body.users = [];
                alertMessage = 'This resource can`t be used to make changes to the user list. Use the available resources in the users and groups APIs to join or leave groups.';
            }
            groupModel
                .findByIdAndUpdate(req.params.id, req.body, { new: true })
                .then(group => {
                    if(!group) res.status(404).json(errorParser.parse('groups-1', {}))
                    else res.json({
                            userMessage: 'The group was updated successfully.',
                            alertMessage,
                            group
                        });
                }, error => {
                        if(error.name == "CastError")res.status(400).json(errorParser.parse('groups-2', error))
                        else res.status(500).json(errorParser.parse('groups-3', error));
                });
        }
    };

    api.removeById = (req, res) => {
        userModel // first we remove the group information from all users thats belongs to this group
            .find({ 'groups._id': req.params.id })
            .then(users =>
                Promise.all(users.map(user => {
                    user.groups = user.groups.filter(group => group._id != req.params.id);
                    user.save();
                    return user;
                })))
            .then(() => 
                groupModel
                    .remove({ _id: req.params.id })
                    .then(() => res.sendStatus(204)), 
            error => {
                if(error.name == "CastError")res.status(400).json(errorParser.parse('groups-2', {}))
                else res.status(500).json(errorParser.parse('groups-3', error));
            });
    };

    api.include = (req, res) => {
        var arr = req.body;
        if(!Array.isArray(arr)) res.status(400).json(errorParser.parse('groups-6', {}))
        else groupModel
                .findById(req.params.groupId)
                .then(group => {
                    if(!group) res.status(404).json(errorParser.parse('groups-1', {}))
                    else userModel
                            .find({ '_id': { $in: req.body } })
                            .then(users => {
                                let list = users.filter(user => {
                                    return !(user.groups.some(g => g._id == group._id.toString()));
                                }).map(user => {
                                    user.groups.push(group);
                                    user.save();
                                    return user;
                                });
                                group.users = group.users.concat(list);
                                group.save();
                                res.status(200).json({
                                    userMessage: 'Users successfully included to a group .',
                                    group 
                                });
                            }, error => {
                                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                                else res.status(500).json(errorParser.parse('users-1', error));
                            });
                }, error => {
                    if(error.name == "CastError")res.status(400).json(errorParser.parse('groups-2', error))
                    else res.status(500).json(errorParser.parse('groups-3', error));
                });
    };

    api.remove = (req, res) => {
        var arr = req.body;
        if(!Array.isArray(arr)) res.status(400).json(errorParser.parse('groups-6', {}))
        else groupModel
                .findById(req.params.groupId)
                .then(group => {
                    if(!group) res.status(404).json(errorParser.parse('groups-1', {}))
                    else userModel
                            .find({ '_id': { $in: req.body } })
                            .then(users => {
                                users.forEach(user => {
                                    user.groups = user.groups.filter(g => g._id != group._id.toString());
                                    user.save();
                                    group.users = group.users.filter(u => u._id != user._id.toString());
                                    group.save();
                                });
                                res.status(200).json({
                                    userMessage: 'Users successfully removed from a group '+group.name+ '.',
                                    group 
                                })
                            }, error => {
                                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                                else res.status(500).json(errorParser.parse('users-1', error));
                            });
                }, error => {
                    if(error.name == "CastError")res.status(400).json(errorParser.parse('groups-2', error))
                    else res.status(500).json(errorParser.parse('groups-3', error));
                });
    };

    return api;
}
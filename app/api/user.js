module.exports = app => {

    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken')
    const api = {};
    const userModel = mongoose.model('User');
    const groupModel = mongoose.model('Group');
    const errorParser = app.helpers.errorParser;
    const multer = require('multer');
    const path = require('path');
    const https = require('https');

    api.create = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('users-10', {}))
        else {
            if(req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 10);
            let alertMessage = '';
            if(req.body.groups){
                req.body.groups = [];
                alertMessage = 'This resource can`t be used to include users on groups. Use the available resources in the users and groups APIs to join or leave groups.';
            }
            userModel
                .create(req.body)
                .then(user => {
                    user.link = {
                        rel: 'user',
                        href: app.get('userApiRoute') + user._id
                    };
                    user.save();
                    user = user.toObject(); 
                    delete user.password;
                    res.status(201).json({
                        userMessage: 'User created successfully. ',
                        alertMessage,
                        user 
                    });
                }, error => {
                    let err = error.toJSON();
                    if(err.name == 'ValidationError') res.status(400).json(errorParser.parse('users-2', err))
                    else if(err.errmsg.includes("E11000")){
                        delete err.op.password;
                        res.status(400).json(errorParser.parse('users-3', err));
                    } else res.status(500).json(errorParser.parse('users-1', err));
                });
        }
    };

    api.list = (req, res) => {
        userModel
            .find({}).select('-password')
            .then(users => res.json(users), error => res.status(500).json(errorParser.parse('users-1', error)));
    };

    api.bulkUpdate = (req, res) => {
        const arr = req.body;
        if(!Array.isArray(arr)) res.status(400).json(errorParser.parse('users-4', {}))
        else {
            let alertMessage = ''; 
            let bulk = [];
            arr.forEach(user => {
                let keys = Object.keys(user);
                let userUpdate = {};
                userUpdate.updateOne = {};
                userUpdate.updateOne.filter = { _id: user._id };
                userUpdate.updateOne.update = {};
                keys.forEach(key => {
                    if(key == 'groups') alertMessage = 'This resource can`t be used to make changes to the group list. Use the available resources in the users and groups APIs to join or leave groups.'
                    else if(key != '_id') userUpdate.updateOne.update[key] = user[key];
                });
                bulk.push(userUpdate);
            });
            userModel
                .bulkWrite(bulk)
                .then(result => res.json({
                                    userMessage: result.nModified + ' of ' + result.nMatched + ' users sended was uptaded successfully.',
                                    alertMessage,
                                    devMessage: result
                                }),
                error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                    else res.status(500).json(errorParser.parse('users-1', error));
                });
        }
    };

    api.removeAll = (req, res) => {
        groupModel
            .update({}, { users: [] }, { multi: true })
            .then(() => 
                userModel
                    .remove({})
                    .then(() => res.sendStatus(204), error => res.status(500).json(errorParser.parse('users-1', error))), 
            error => res.status(500).json(errorParser.parse('groups-3', error)));
    };

    api.notAllowed = (req, res) => {
        res.status(405).json(errorParser.parse('users-6', {}));
    };

    api.findById = (req, res) => {
        userModel
            .findById(req.params.id).select('-password')
            .then(user => {
                if(!user) res.status(404).json(errorParser.parse('users-7', {}))
                else res.json(user);
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                else res.status(500).json(errorParser.parse('users-1', error)); 
            });
    };

    api.findByName = (req, res) => {
        userModel
            .find({name: new RegExp('^'+req.params.name+'$', "i")})
            .then(users => {
                if(!users) res.status(404).json(errorParser.parse('users-7', {}))
                else res.json(users);
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                else res.status(500).json(errorParser.parse('users-1', error)); 
            });
    };

    api.update = (req, res) => {
        if(!(Object.prototype.toString.call(req.body) === '[object Object]')) res.status(400).json(errorParser.parse('users-10', {}))
        else {
            let alertMessage = '';
            if(req.body.groups){
                req.body.groups = [];
                alertMessage = 'This resource can`t be used to make changes to the group list. Use the available resources in the users and groups APIs to join or leave groups.';
            }
            userModel
                .findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')
                .then(user => {
                    if(!user) res.status(404).json(errorParser.parse('users-7', {}))
                    else res.json({
                            userMessage: 'The user was updated. ', 
                            alertMessage,    
                            user
                        });
                }, error => {
                    if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                    else res.status(500).json(errorParser.parse('users-1', error));    
                });
        }
    };

    api.removeById = (req, res) => {
        groupModel
            .find({ 'users._id': req.params.id })
            .then(groups => 
                Promise.all(groups.map(group => {
                        group.users = group.users.filter(user => user._id != req.params.id);
                        group.save();
                        return group;
                })))
            .then(() => 
                userModel
                    .remove({ _id: req.params.id })
                    .then(() => res.sendStatus(204)),
            error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                else res.status(500).json(errorParser.parse('users-1', error));
            });
    };

    api.joinGroup = (req, res) => {
        userModel
            .findById(req.params.id).select("-password")
            .then(user => {
                if(!user) res.status(404).json(errorParser.parse('users-7', {}))
                else 
                    groupModel
                        .findById(req.params.groupId)
                        .then(group => {
                            if(!group) res.status(404).json(errorParser.parse('groups-1', {}))
                            else if (!group.isPublic) res.status(401).json(errorParser.parse('groups-9', {}))
                            else {
                                let groups = user.groups.toObject();
                                if(groups.some(g => g._id == group._id.toString())) res.status(400).json(errorParser.parse('users-8', {}))
                                else {
                                    let insertGroup = {};
                                    insertGroup._id = group._id;
                                    insertGroup.name = group.name;
                                    insertGroup.link = group.link;

                                    let insertUser = {};
                                    insertUser._id = user._id;
                                    insertUser.username = user.username;
                                    insertUser.link = user.link;

                                    user.groups.push(insertGroup);
                                    group.users.push(insertUser);

                                    user.save();
                                    group.save();
                                    res.status(200).json({
                                        userMessage: 'User inserted in the group ' + group.name + ' successfully.',
                                        user 
                                    });
                                }
                            }
                        }, error => {
                            if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-2', error))
                            else res.status(500).json(errorParser.parse('groups-3', error));
                        });
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                else res.status(500).json(errorParser.parse('users-1', error));
            });
    };

    api.leaveGroup = (req, res) => {
        userModel
            .findById(req.params.id).select('-password')
            .then(user => {
                if(!user) res.status(404).json(errorParser.parse('users-7', {}))
                else 
                    groupModel
                        .findById(req.params.groupId)
                        .then(group => {
                            if(!group) res.status(404).json(errorParser.parse('groups-1', {}))
                            else {
                                let groups = user.groups.toObject();
                                if(!groups.some(g => g._id == group._id.toString())) res.status(400).json(errorParser.parse('users-9', {}))
                                else {
                                    user.groups = user.groups.filter(g => g._id != group._id.toString());
                                    group.users = group.users.filter(u => u._id != user._id.toString());        
                                    user.save();
                                    group.save();
                                    res.status(200).json({
                                        userMessage: 'User removed from group ' + group.name + ' successfully.',
                                        user 
                                    });
                                }
                            }
                        }, error => {
                            if(error.name == "CastError") res.status(400).json(errorParser.parse('groups-2', error))
                            else res.status(500).json(errorParser.parse('groups-3', error));
                        });
            }, error => {
                if(error.name == "CastError") res.status(400).json(errorParser.parse('users-5', error))
                else res.status(500).json(errorParser.parse('users-1', error));
            });
    };

    api.me = (req, res) => {
        userModel
            .findById(req.auth.user._id)
            .then(user => {
                user = user.toObject(); 
                delete user.password;
                res.json(user)}
                , error => res.status(500).json(errorParser.parse('users-1', error)));
    };

    api.photo = (req, res) => {

        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, './public/profiles'),
            filename: (req, file, cb) => cb(null, file.fieldname + '-' + req.auth.user._id + path.extname(file.originalname))  
        });

        const upload = multer({ storage }).single('profile');

        upload(req, res, error => {
            if(error) res.status(500).json(errorParser.parse('users-11', error))
            else userModel
                    .findById(req.auth.user._id)
                    .then(user => {
                        user.profilePicture = req.file.path.replace("public", "");
                        console.log(user);
                        user.save();
                        res.sendStatus(200);
                    });
        });
    }

    api.fbCreate = (req, res) => {
        if(!req.body.access_token) res.status(400).json(errorParser.parse('users-12', {}))
        else 
            https.get(app.get('facebookUrl') + req.body.access_token, response => {
                response.setEncoding("utf8");
                let body = "";
                response.on("data", data => {
                    body += data;
                });
                response.on("end", () => {
                    body = JSON.parse(body);
                    //CONFIG USER OBJECT TO SAVE
                    let username = body.name.toLowerCase().split(" ");
                    username = username[0]+username[username.length-1];
                    body.username = username;
                    body.password = bcrypt.hashSync(app.get('defaultPassword'), 10);
                    body.facebookProvider = {}
                    body.facebookProvider.id = body.id;
                    body.facebookProvider.access_token = req.body.access_token;
                    delete body.id;

                    userModel
                        .create(body)
                        .then(user => {
                            user.link = {
                                rel: 'self',
                                href: app.get('userApiRoute') + user._id
                            };
                            user.save();
                            user = user.toObject(); 
                            delete user.password;
                            var token = jwt.sign({ user }, app.get('secret'), { expiresIn: 86400 });
                            res.set('x-access-token', token);
                            res.status(201).json({
                                userMessage: 'User created successfully. ',
                                user
                            });
                        }, error => {
                            let err = error.toJSON();
                            if(err.name == 'ValidationError') res.status(400).json(errorParser.parse('users-2', err))
                            else if(err.errmsg.includes("E11000")){
                                delete err.op.password;
                                res.status(400).json(errorParser.parse('users-3', err));
                            } else res.status(500).json(errorParser.parse('users-1', err));
                        });
                });
            });

    }

    api.gCreate = (req, res) => {
        if(!(req.body.id_token)) res.status(400).json(errorParser.parse('users-13', {}))
        else 
            https.get(app.get('googleUrl') + req.body.id_token, response => {
                response.setEncoding("utf8");
                let body = "";
                response.on("data", data => {
                    body += data;
                });
                response.on("end", () => {
                    let user = {};
                    body = JSON.parse(body);
                    //CONFIG USER OBJECT TO SAVE
                    let username = body.name.toLowerCase().split(" ");
                    username = username[0]+username[username.length-1];
                    user.username = username;
                    user.password = bcrypt.hashSync(app.get('defaultPassword'), 10);
                    user.googleProvider = {}
                    user.googleProvider.id = req.body.id;
                    user.googleProvider.id_token = req.body.id_token;
                    user.email = body.email;
                    user.name = body.name;
                    user.profilePicture = body.picture;
                    

                    userModel
                        .create(user)
                        .then(user => {
                            user.link = {
                                rel: 'self',
                                href: app.get('userApiRoute') + user._id
                            };
                            user.save();
                            user = user.toObject(); 
                            delete user.password;
                            var token = jwt.sign({ user }, app.get('secret'), { expiresIn: 86400 });
                            res.set('x-access-token', token);
                            res.status(201).json({
                                userMessage: 'User created successfully. ',
                                user
                            });
                        }, error => {
                            let err = error.toJSON();
                            if(err.name == 'ValidationError') res.status(400).json(errorParser.parse('users-2', err))
                            else if(err.errmsg.includes("E11000")){
                                delete err.op.password;
                                res.status(400).json(errorParser.parse('users-3', err));
                            } else res.status(500).json(errorParser.parse('users-1', err));
                        });
                });
            });

    }

    return api;
}
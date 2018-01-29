module.exports = app => {

    const mongoose = require('mongoose');
    const api = {};
    const userModel = mongoose.model('User');
    const errorParser = app.helpers.errorParser;
    const multer = require('multer');
    const path = require('path');

    api.myUser = (req, res) => {
        userModel
            .findById(req.auth.user._id)
            .then(user => {
                user = user.toObject(); 
                delete user.password;
                res.json(user)}
                , error => res.status(500).json(errorParser.parse('users-1', error)));
    };

    api.myMaps = (req, res) => {
        userModel
            .findById(req.auth.user._id)
            .then(user => {
                res.json(user.maps)}
                , error => res.status(500).json(errorParser.parse('users-1', error)));
    }

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

    return api;
}
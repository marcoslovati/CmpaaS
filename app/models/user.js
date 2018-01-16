var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    groups: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Group'
            },
            name: {
                type: String
            },
            link: {
                rel: {
                    type: String
                },
                href: {
                    type: String
                }
            }
        }
    ],
    link: {
        rel: {
            type: String
        },
        href: {
            type: String
        }
    },
    maps: [{
        _id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Map'
            },
        title: {
            type: String
        },
        link: {
                rel: {
                    type: String
                },
                href: {
                    type: String
                }
            }
    }]
}, { usePushEach: true });

schema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', schema);

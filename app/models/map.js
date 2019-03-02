var mongoose = require('mongoose');

var schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        username: {
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
    },
    activity: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Activity'
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
    },
    link: {
        rel: {
            type: String
        },
        href: {
            type: String
        }
    },
    versions: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'MapContent'
            },
            version: {
                type: Number
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
    ]
}, { usePushEach: true });

mongoose.model('Map', schema);

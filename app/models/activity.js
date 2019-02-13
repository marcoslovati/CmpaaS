var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    creator: {
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
    }
}, { usePushEach: true });

mongoose.model('Activity', schema);
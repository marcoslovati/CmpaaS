var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
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
    link: {
        rel: {
            type: String
        },
        href: {
            type: String
        }
    }
}, { usePushEach: true });

mongoose.model('Debate', schema);
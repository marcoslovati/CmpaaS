var mongoose = require('mongoose');

var schema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    map: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Map'
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
    content: {
        type: mongoose.Schema.Types.Mixed
    },
    link: {
        rel: {
            type: String
        },
        href: {
            type: String
        }
    },
    image: {
        type: String
    }
}, { usePushEach: true });

mongoose.model('MapContent', schema);

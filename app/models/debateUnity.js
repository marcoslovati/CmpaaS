var mongoose = require('mongoose');

var schema = mongoose.Schema({
    mapContentInitial: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'MapContent'
            },
            created: {
                type: Date
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
    questioner1: {
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
    question1: {
        type: String
    },
    question2: {
        type: String
    },
    questioner2: {
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
    question3: {
        type: String
    },
    question4: {
        type: String
    },
    mapContentFinal: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'MapContent'
            },
            created: {
                type: Date
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

mongoose.model('DebateUnity', schema);
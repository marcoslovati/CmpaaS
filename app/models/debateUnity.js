var mongoose = require('mongoose');

var schema = mongoose.Schema({
    debate: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Debate'
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
    mapsAuthor: {
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
    initialMapContent: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'MapContent'
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
    initialDistance:{
        type: Number
    },
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
    finalMapContent: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'MapContent'
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
    finalDistance:{
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
}, { usePushEach: true });

mongoose.model('DebateUnity', schema);
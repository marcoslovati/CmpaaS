module.exports = (uri) => {
    var mongoose = require('mongoose');

    mongoose.Promise = global.Promise;

    mongoose.connect('mongodb://' + uri, { useMongoClient: true });

    mongoose.connection.on('connected', () => {
        console.log('CMPaaS connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
        console.log('Connection error: ' + error);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('CMPaaS disconnected from MongoDB');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(()=>{
            console.log('Connection closed from application close.');
            process.exit(0);
        });
    });
}
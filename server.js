var http = require('http');
var app = require('./config/express');
require('./config/database')('localhost/cmpaas');

Array.prototype.contains = (element) => {
    return this.indexOf(element) > -1;
}

http.createServer(app).listen(3000, () => {
    console.log('Server running and listen at port 3000.');
});
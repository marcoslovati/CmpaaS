module.exports = app => {
    var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('../swagger/swagger.json');

    app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
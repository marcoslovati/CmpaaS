module.exports = app => {
    let parser = {};
    let error = {};

    parser.parse = (errorCode, errorObject) => {
        switch(errorCode){
            case 'users-1':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Internal server error: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'users-2':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.message,
                    devMessage: errorObject
                };
                break;
            case 'users-3':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'users-4':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Bad request: This resource expects an array of objects.',
                    devMessage: 'The user not sent a array'
                };
                break;
            case 'users-5':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'users-6':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'The requested method is not allowed',
                    devMessage: 'The requested method is invalid.'
                };
                break;
            case 'users-7':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'The request user id was not found.',
                    devMessage: 'Invalid user ID.'
                };
                break;
            case 'users-8':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'This user is already member of this group.',
                    devMessage: 'Invalid request from user (user already a member of the group).'
                };
                break;
            case 'users-9':
                error = {
                    errorCode: 'users-9',
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'This user is not a member of this group.',
                    devMessage: 'Invalid request from user (user is not a member of the group).'
                };
                break;
            case 'users-10':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'The request body is incorrect.',
                    devMessage: 'This resource spect a object in the body request.'
                };
                break;
            case 'users-11':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Internal server error: Error to upload photo',
                    devMessage: errorObject
                };
                break;
            case 'users-12':
                error = {
                    errorCode,
                    moreInfo: app.get('userApiErrorsRoute'),
                    userMessage: 'Bad Request: Facebook access_token not provided',
                    devMessage: errorObject
                };
                break;
            case 'groups-1':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'The group id was not found.',
                    devMessage: 'Invalid group ID.'
                };
                break;
            case 'groups-2':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'groups-3':
                errors = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'Internal server error: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'groups-4':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.message,
                    devMessage: errorObject
                };
                break;
            case 'groups-5':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'Bad request: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'groups-6':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'Bad request: This resource expects an array of objects.',
                    devMessage: 'The user not sent a array'
                };
                break;
            case 'groups-7':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'The requested method is not allowed',
                    devMessage: 'The requested method is invalid.'
                };
                break;
            case 'groups-8':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'The request body is incorrect.',
                    devMessage: 'This resource spect a object in the body request.'
                };
                break;
            case 'groups-9':
                error = {
                    errorCode,
                    moreInfo: app.get('groupApiErrorsRoute'),
                    userMessage: 'You can not join to a private group.',
                    devMessage: 'Private group join not allowed.'
                };
                break;
            case 'auth-1':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'The provided username was not found.',
                    devMessage: 'Invalid username.'
                };
                break;
            case 'auth-2':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'The username and/or password provided were incorrect',
                    devMessage: 'Invalid password.'
                };
                break;
            case 'auth-3':
                errors = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Internal server error: ' + errorObject.errmsg,
                    devMessage: errorObject
                };
                break;
            case 'auth-4':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Bad request: This resource expects an object containing user and password.',
                    devMessage: 'Bad request from the user.'
                };
                break;
            case 'auth-5':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Not authorized: Authentication token invalid or expired.',
                    devMessage: 'Invalid or expired token.'
                };
                break;
            case 'auth-6':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Authentication required: You have to send the X-Access-Token header to access this resource. Use the authentication uri to obtain the token.',
                    devMessage: 'Token not sended.',
                    redirectTo: app.get('authApiRoute')
                };
                break;
            case 'auth-7':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Administration Level required: This resource is available only for administrators.',
                    devMessage: 'AdminLevel required.'
                };
                break;
            case 'auth-8':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Access not allowed: This resource is available only for administrators or owner user.',
                    devMessage: 'Admin or User Only method.'
                };
                break;
            case 'auth-9':
                error = {
                    errorCode,
                    moreInfo: app.get('authApiErrorsRoute'),
                    userMessage: 'Not Allowed: Only group admin can use this resource.',
                    devMessage: 'Group Admin method.'
                };
                break;
            case 'maps-1':
                error = {
                    errorCode,
                    moreInfo: app.get('mapApiErrorsRoute'),
                    userMessage: 'The request body is incorrect.',
                    devMessage: 'This resource spect a object in the body request.'
                };
                break;
            case 'maps-2':
                error = {
                    errorCode,
                    moreInfo: app.get('mapApiErrorsRoute'),
                    userMessage: 'Internal server error: ' + errorObject.message,
                    devMessage: errorObject
                };
                break;
        }

        return error;
    }

    return parser;
}
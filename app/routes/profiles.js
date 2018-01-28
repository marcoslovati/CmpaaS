module.exports = app => {
    const multer = require('multer');
    const path = require('path');
    
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/profiles')
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({
        storage: storage
    }).single('profile');

    app.post('/v1/profiles', (req, res) => {
        upload(req, res, (error) => {
            if(error){
                res.send('error');
            }else{
                console.log(req.file);
                res.send('test');
            }
        });
    });
}
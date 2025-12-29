const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadPath = path.join(__dirname, '..', 'uploads');


// Ensure upload directory exists
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);   
    },
    filename: function (req, file, cb) {
        const ext =path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext);
    }
});
const fileFilter = (req, file, cb) => {

    const allowd =['image/jpeg','image/jpg','image/png'];
    if(allowd.includes(file.mimetype)){
        cb(null,true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

module.exports = multer({ storage: storage, fileFilter });
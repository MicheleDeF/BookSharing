const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const targetDir = 'public/images/books/';

        fs.mkdirSync(targetDir, { recursive: true });
        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}-copertina${ext}`);
    }
});


const upload = multer({ storage: storage });


module.exports = upload;

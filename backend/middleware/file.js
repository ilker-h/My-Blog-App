// this file is for outsourcing the multer-related middleware. This isn't necessary since we're
// only using multer in the routes/posts.js, but Max is doing it in case we need to use it somewhere
// else too (although I think this is premature optimization, but he may just be doing it
// for learning purposes)

const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// Configuring multer so it knows when, where and how to store files (e.g. images) that are uploaded by the user
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // cb = call back function
        const isValid = MIME_TYPE_MAP[file.mimetype]; // will return null if it gets a mimetype that's not part of the map
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images"); // relative to server.js
    },
    filename: (req, file, cb) => {
        // this normalizes the data. Also, any white space in the filename will be replaced with a dash
        const name = file.originalname.toLowerCase().split(' ').join('-');

        // getting the file extensions with a callback function
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});

module.exports =  multer({ storage: storage }).single('image');
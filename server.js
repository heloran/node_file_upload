const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('error: images only')
    }

}

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) =>{
        if (err){
            res.render('index', {
                msg: err
            });
        } else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: no file selected'
                });
            }else{
                res.render('index', {
                    msg: 'File Uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})
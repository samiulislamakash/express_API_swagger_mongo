const express = require('express')
const multer = require('multer')
const ImageUpload = express.Router();
const Image = require('./imgUpload.model')

const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const filterFile = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.minetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(new Error('somthing wrong'), false)
    }
}

const upload = multer({
    storage: storages,
    limites: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filterFile
})

ImageUpload.post('/create', upload.single('image'), async (req, res) => {
    const image = new Image({
        url: 'http://localhost:3000/' + req.file.path,
    })

    await image.save().then((img) => {
        res.status(201).send(img);
    }).catch(() => {
        res.status(400).send({ message: 'Bad Request' })
    })
})

module.exports = ImageUpload;
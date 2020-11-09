const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    }
})

const Image = mongoose.model('images', ImageSchema)

module.exports = Image;
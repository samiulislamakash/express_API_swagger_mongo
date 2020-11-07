const mongoose = require('mongoose')

const DemoSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    description: {
        type: String
    }
})

const Demo = mongoose.model('demos', DemoSchema);

module.exports = Demo;
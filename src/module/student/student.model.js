const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    schoolName: {
        type: String,
        trim: true,
        minlength: 1,
        required: true,
    },
    gender: {
        type: String,
    }
})

const Student = mongoose.model('students', TaskSchema);

module.exports = Student
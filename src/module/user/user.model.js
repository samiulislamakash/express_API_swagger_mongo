const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    sessions: [{
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Number,
            required: true,
        }
    }]
}, {
    timestamps: true
})

// before save password hash
UserSchema.pre('save', async function (next) {
    let user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
        next()
    } else {
        next()
    }
})

// witch property are not show in response made disition in there
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.omit(userObject, ['password', 'sessions']);
}

// jwt token generate 
UserSchema.statics.generateAccessToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id }, process.env.JWT_SECRET, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject();
            }
        })
    })
}

// findby credentials
UserSchema.statics.findByCredentials = function (email, password) {
    const user = this

    return User.findOne({ email: email }).then((user) => {
        if (!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            })
        })
    })
}

const User = mongoose.model('users', UserSchema);
module.exports = User
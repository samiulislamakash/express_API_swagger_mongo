const exporess = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRoute = exporess.Router();

const User = require('./user.model')
const { updateInfoCheck, credentialCheck, passwordReset } = require('../../middleware/user.middleware')

// create -- as use for user registration

UserRoute.post('/create', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        })

        await user.save().then((d) => {
            res.status(201).send({ success: true, data: d });
        }).catch((e) => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// login 

UserRoute.post('/login', credentialCheck, async (req, res) => {
    try {
        const { email, password } = req.body;
        User.findByCredentials(email, password).then((user) => {
            User.generateAccessToken().then((token) => {
                let obj = {
                    user,
                    token,
                }

                res.status(200).send({ success: true, data: obj })
            }).catch(() => {
                res.status(400).send({ success: false, message: 'Bad Request' })
            })
        }).catch(() => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })

    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// change password

UserRoute.patch('/password-reset/:id', passwordReset, async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        let hashpass = await bcrypt.hash(newPassword, 8);
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            password: hashpass
        }).then(() => {
            res.status(200).send({ success: true, message: "Password Update successfull" })
        }).catch(() => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// read all in pagination

UserRoute.get('/all', async (req, res) => {
    try {
        let { limit = 10, page = 1 } = req.query;
        let user;
        let typeConform = typeof limit
        if (typeConform != 'number' && limit.toLowerCase() == 'all') {
            user = User.find().sort({ createdAt: -1 })
        } else {
            if (req.query) {
                limit = parseInt(limit); page = parseInt(page)
            }
            user = User.find().limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 })
        }

        let users = await user;

        if (!users) {
            return res.status(404).send({ success: false, message: "Data not found" })
        }
        const totalResult = await User.countDocuments();
        res.status(200).send({
            success: true,
            totalResults: totalResult,
            limit: limit,
            page: page,
            data: users
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// read one

UserRoute.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id
        })

        if (!user) {
            return res.status(404).send({ success: false, message: "Data not found" })
        }

        res.status(200).send({ success: true, data: user })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// update one

UserRoute.patch("/update/:id", updateInfoCheck, async (req, res) => {
    try {
        await User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }).then(() => {
            res.status(200).send({ success: true, message: "Data Update successfull" })
        }).catch(() => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// delete one

UserRoute.delete('/delete/:id', async (req, res) => {
    await User.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.status(201).send({ success: true, message: "Data Delete successfull" })
    }).catch(() => {
        res.status(400).send({ success: false, message: 'Bad Request' })
    })
})

module.exports = UserRoute
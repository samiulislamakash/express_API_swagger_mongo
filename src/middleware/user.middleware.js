const User = require('../module/user/user.model')
const bcrypt = require('bcrypt')

let updateInfoCheck = function (req, res, next) {
    let key = Object.keys(req.body)
    if (key.includes('password')) {
        return res.status(400).send({ success: false, message: 'Bad Request' });
    } else {
        next()
    }
}

let credentialCheck = function (req, res, next) {
    let key = Object.keys(req.body);
    if (key.includes('email') && key.includes('password')) {
        next()
    } else {
        return res.status(400).send({ success: false, message: 'Bad Request' })
    }
}


let passwordReset = async function (req, res, next) {
    const { password, newPassword } = req.body;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(400).send({ success: false, message: 'Bad Request' });
    }

    await bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            next();
        } else {
            return res.status(400).send({ success: false, message: 'Bad Request' });
        }
    })
}


module.exports = { updateInfoCheck, credentialCheck, passwordReset }
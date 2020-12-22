const User = require('../module/user/user.model')

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



module.exports = { updateInfoCheck, credentialCheck }
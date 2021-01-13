let checkMailBody = function (req, res, next) {
    const data = req.body;
    if (!data.to || !data.subject || !data.text) {
        return res.status(400).send({ success: false, message: 'Bad Request' })
    } else {
        next();
    }

}

module.exports = { checkMailBody }
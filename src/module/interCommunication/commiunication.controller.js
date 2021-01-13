const exporess = require('express')
const CommiunicationRoutes = exporess.Router();
const sgMail = require('@sendgrid/mail')
const { checkMailBody } = require('../../middleware/commiunication.middleware');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

CommiunicationRoutes.post('/mail-send', checkMailBody, async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const msg = {
            to,
            from: process.env.SEDNGRID_SENDER,
            subject,
            text,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        sgMail
            .send(msg)
            .then(() => {
                res.status(200).send({ success: true, message: 'Mail Send Successfull.' })
            })
            .catch((error) => {
                res.status(400).send({ success: false, message: 'Mail Sending Error' })
            })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

module.exports = CommiunicationRoutes
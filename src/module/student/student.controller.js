const express = require('express')
const StudentRoute = express.Router();


// model 
const Student = require('./student.model')

/**
 * GET /all
 * all student get
 */

StudentRoute.get('/all', async (req, res) => {
    try {
        const student = await Student.find();

        if (!student) {
            res.status(400).send({ message: 'Bad Request' })
        }

        res.status(200).send(student);
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

/**
 * Get /:id
 * one student get
 */

StudentRoute.get('/:id', async (req, res) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id
        })

        if (!student) {
            res.status(400).send({ message: 'Bad Request' })
        }

        res.status(200).send(student);
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

/**
 * POST /create
 * create one student
 */
StudentRoute.post('/create', async (req, res) => {
    try {
        const student = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            schoolName: req.body.schoolName,
            gender: req.body.gender
        })

        await student.save().then((newStudent) => {
            res.status(201).send(newStudent);
        }).catch((e) => {
            res.status(400).send({ message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

/**
 * POST /create/bulk
 * post array of user
 */

StudentRoute.post('/create/bulk', async (req, res) => {
    try {
        await Student.insertMany(req.body).then((all) => {
            res.status(201).send(all);
        }).catch((e) => {
            res.status(400).send({ message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


module.exports = StudentRoute;
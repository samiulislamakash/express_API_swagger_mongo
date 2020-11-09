const exporess = require('express')
const DemoRoutes = exporess.Router();


const Demo = require('./demo.model')

// create

DemoRoutes.post('/create', async (req, res) => {
    try {
        const demo = new Demo({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            age: req.body.age,
            description: req.body.age
        })

        await demo.save().then((d) => {
            res.status(201).send(d);
        }).catch((e) => {
            res.status(400).send({ message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// multiple create 

DemoRoutes.post("/create/bulk", async (req, res) => {
    try {
        await Demo.insertMany(req.body).then((allDemo) => {
            res.status(201).send(allDemo);
        }).catch(() => {
            res.status(400).send({ message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// read

DemoRoutes.get('/all', async (req, res) => {
    try {
        const demo = await Demo.find();
        if (!demo) {
            return res.status(404).send({ message: "Data not found" })
        }
        res.status(200).send(demo)
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// read one

DemoRoutes.get('/:id', async (req, res) => {
    try {
        const demo = await Demo.findOne({
            _id: req.params.id
        })

        if (!demo) {
            return res.status(404).send({ message: "Data not found" })
        }

        res.status(200).send(demo)
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// update one

DemoRoutes.patch("/update/:id", async (req, res) => {
    try {
        await Demo.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }).then(() => {
            res.status(200).send({ message: "Data Update successfull" })
        }).catch(() => {
            res.status(400).send({ message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// delete one

DemoRoutes.delete('/delete/:id', async (req, res) => {
    await Demo.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.status(201).send({ message: "Data Delete successfull" })
    }).catch(() => {
        res.status(400).send({ message: 'Bad Request' })
    })
})

module.exports = DemoRoutes
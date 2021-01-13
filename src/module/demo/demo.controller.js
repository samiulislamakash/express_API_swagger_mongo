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
            res.status(201).send({ success: true, data: d });
        }).catch((e) => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// multiple create 

DemoRoutes.post("/create/bulk", async (req, res) => {
    try {
        await Demo.insertMany(req.body).then((allDemo) => {
            res.status(201).send({ success: true, data: allDemo });
        }).catch(() => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// read

DemoRoutes.get('/all', async (req, res) => {
    try {
        const demo = await Demo.find();
        if (!demo) {
            return res.status(404).send({ success: false, message: "Data not found" })
        }
        res.status(200).send({ success: false, data: demo })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// read pagination

DemoRoutes.get('/pagination', async (req, res) => {
    try {
        let { limit = 10, page = 1 } = req.query;
        let demo;
        let typeConform = typeof limit
        if (typeConform != 'number' && limit.toLowerCase() == 'all') {
            demo = Demo.find().sort({ createdAt: -1 })
        } else {
            if (req.query) {
                limit = parseInt(limit); page = parseInt(page)
            }
            demo = Demo.find().limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 })
        }

        let demos = await demo;

        if (!demos) {
            return res.status(404).send({ success: false, message: "Data not found" })
        }
        const totalResult = await Demo.countDocuments();
        res.status(200).send({
            success: true,
            totalResults: totalResult,
            limit: limit,
            page: page,
            data: demos
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// read one

DemoRoutes.get('/:id', async (req, res) => {
    try {
        const demo = await Demo.findOne({
            _id: req.params.id
        })

        if (!demo) {
            return res.status(404).send({ success: false, message: "Data not found" })
        }

        res.status(200).send({ success: true, data: demo })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
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
            res.status(200).send({ success: true, message: "Data Update successfull" })
        }).catch(() => {
            res.status(400).send({ success: false, message: 'Bad Request' })
        })
    } catch (e) {
        res.status(500).send({ success: false, message: 'Internal Server Error' })
    }
})

// delete one

DemoRoutes.delete('/delete/:id', async (req, res) => {
    await Demo.findOneAndRemove({
        _id: req.params.id
    }).then(() => {
        res.status(201).send({ success: true, message: "Data Delete successfull" })
    }).catch(() => {
        res.status(400).send({ success: false, message: 'Bad Request' })
    })
})

module.exports = DemoRoutes
/**import  */
const express = require('express');
const cors = require('cors');
require('./src/config/db.config.js')
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// config
const app = express()
const port = process.env.PORT

/** middleware */
app.use(cors())
app.use(express.json())
app.use('/api/uploads', express.static('uploads'));
app.use('/api/demo', require('./src/module/demo/demo.controller'));
app.use('/api/user', require('./src/module/user/user.controller'));
app.use('/api/image', require('./src/module/imgUpload/imgUpload.controller'));
app.use('/api/interCommunication', require('./src/module/interCommunication/commiunication.controller'))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/** end middleware */

// demo url
app.get('/', (req, res) => {
    res.status(200).send('hello server is working');
})

// server run
app.listen(port, () => {
    console.log('Server is listern ' + port)
})
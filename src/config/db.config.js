const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TestMongoose', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connect to MongoDB Successfull')
}).catch((e) => {
    console.log('Not connected in MongoDB ')
    console.log(e)
})
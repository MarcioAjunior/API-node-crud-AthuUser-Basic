const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://curso:curso@devunc-marcio-lkpu4.mongodb.net/Curso', { useUnifiedTopology: true, useCreateIndex : true, useNewUrlParser: true } )
mongoose.Promise = global.Promise;


module.exports = mongoose

//mongodb+srv://curso:curso@devunc-marcio-lkpu4.mongodb.net/Curso
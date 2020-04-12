const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config');

let mongoUrlFinal = mongoUrl;

if (process.env.RUNDOCKER) {
	mongoUrlFinal = 'mongodb://mongo:27017/uus';
}

mongoose.connect(mongoUrlFinal, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, (err) => {
	if (err) throw err;
	console.log('Sucessfully connected to MongoDB database!');
});
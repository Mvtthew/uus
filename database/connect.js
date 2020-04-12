const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config');
const colors = require('colors');

let mongoUrlFinal = mongoUrl;
if (process.env.RUNDOCKER) {
	mongoUrlFinal = 'mongodb://mongo:27017/uus';
}

mongoose.connect(mongoUrlFinal, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
	useCreateIndex: true
}, (err) => {
	if (err) throw console.log(`Connecting to MongoDB failed \nError: `.red + `${err}`);
	console.log('Sucessfully connected to MongoDB database!'.green);
});
const mongoose = require('mongoose');
const { mongoUrl } = require('../config/config');

mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, (err) => {
	if (err) throw err;
	console.log('Sucessfully connected to MongoDB database!');
});
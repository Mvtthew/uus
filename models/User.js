const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	login: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}

});

module.exports = User = mongoose.model('user', userSchema);
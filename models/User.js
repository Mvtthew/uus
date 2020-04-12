const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	// Required
	login: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},

	// Optional
	name: {
		type: String,
		required: false,
		default: ''
	},

	// Profile image
	image: {
		type: String,
		default: ''
	}


});

module.exports = User = mongoose.model('user', userSchema);
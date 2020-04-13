const mongoose = require('mongoose');

const Permission = require('./Permission');

const roleSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		unique: true
	},
	code: {
		type: Number,
		default: 0
	},

	permissions: {
		type: [Permission],
		default: []
	}

});

module.exports = Role = mongoose.model('role', roleSchema);
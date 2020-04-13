const mongoose = require('mongoose');

const Role = require('./Role');

const applicationSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		unique: true
	},

	roles: {
		type: [Role],
		default: []
	}

});

module.exports = Application = mongoose.model('application', applicationSchema);
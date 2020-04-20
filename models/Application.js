const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		unique: true
	},

	operators: {
		type: [String],
		default: []
	},

	// Permissions
	permissions: {
		type: [String],
		default: []
	},

	defaultPermissions: {
		type: [String],
		default: []
	},
	defaultAttributes: {
		type: Object,
		default: {}
	},

	// Users
	users: [
		{
			_uid: {
				type: String,
				required: true
			},
			permissions: {
				type: [String],
				default: []
			},
			attributes: {
				type: Object,
				default: {}
			}
		}
	]

});

module.exports = Application = mongoose.model('application', applicationSchema);
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		unique: true
	},
	code: {
		type: Number,
		default: 0
	}

});

module.exports = Permission = mongoose.model('permission', permissionSchema);
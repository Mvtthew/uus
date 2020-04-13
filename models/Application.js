const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		unique: true
	},

	admins: {
		type: [String],
		default: []
	},

	// Roles
	roles: {
		type: [
			{
				name: {
					type: String,
					required: true
				},
				code: {
					type: Number,
					default: 0
				},

				// Perrmissions
				permissions: {
					type: [
						{
							name: {
								type: String,
								required: true
							},
							code: {
								type: Number,
								default: 0
							}
						}
					],
					default: []
				}
			}
		],
		default: []
	}

});

module.exports = Application = mongoose.model('application', applicationSchema);
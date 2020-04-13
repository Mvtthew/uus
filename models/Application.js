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

				// Perrmissions
				permissions: {
					type: [
						{
							name: {
								type: String,
								required: true
							}
						}
					],
					default: []
				}
			}
		],
		default: [
			{
				name: 'ExampleRole',
				permissions: [
					{ name: 'ExamplePermission' },
					{ name: 'ExamplePermission - feel free to update / delete it' }
				]
			}
		]
	}

});

module.exports = Application = mongoose.model('application', applicationSchema);
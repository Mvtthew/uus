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
	},

	// Users
	users: [
		{
			_uid: {
				type: String,
				required: true
			},
			roles: {
				type: [String],
				default: []
			}
		}
	]

});

module.exports = Application = mongoose.model('application', applicationSchema);
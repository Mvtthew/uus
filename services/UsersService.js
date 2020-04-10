const User = require('../models/User');

module.exports = class UsersService {

	registerUser(userName, login, email, password) {
		if (userName, login, email, password) {

			User.create(userName, login, email, password).then(user => {
				return user;
			}).catch(err => {
				throw err;
			});

		} else {
			return {
				error: true,
				message: "All required fields are not provided"
			};
		}

	};

};


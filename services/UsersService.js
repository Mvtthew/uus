const { Observable } = require('rxjs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = class UsersService {

	registerUser(user) {
		return new Observable(subscriber => {

			const { name, login, email, password } = user;
			if (name && login && email && password) {
				// Login verification
				User.findOne({ login }).then(user => {
					if (!user) {
						// Email verification
						User.findOne({ email }).then(user => {
							if (!user) {

								User.create({
									name,
									login,
									email,
									password: md5(password)
								}).then(user => {
									subscriber.next(user);
								});

							} else {
								subscriber.next({
									error: true,
									message: 'User with that email already exists'
								});
							}
						});
					} else {
						subscriber.next({
							error: true,
							message: 'User with that login already exists'
						});
					}
				});
			} else {
				subscriber.next({
					error: true,
					message: 'All required fields are not provided'
				});
			}

		});
	};
};


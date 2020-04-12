const { Observable } = require('rxjs');
const md5 = require('md5');
const colors = require('colors');

const AuthService = require('./AuthService');
const authService = new AuthService();

const User = require('../models/User');

module.exports = class UsersService {

	registerUser(user) {
		return new Observable(subscriber => {

			const { login, email, password } = user;
			if (login && email && password) {
				// Login verification
				User.findOne({ login }).then(user => {
					if (!user) {
						// Email verification
						User.findOne({ email }).then(user => {
							if (!user) {
								User.create({
									login,
									email,
									password: md5(password)
								}).then(user => {
									console.log(`User {login: ${login}, email: ${email}} just registered`.bgWhite.black);
									subscriber.next({ login: user.login, email: user.email });
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
					message: 'All required fields are not provided (login, email, password)'
				});
			}

		});
	};

	createUserToken(user) {
		return new Observable(subscriber => {

			const { login, email, password } = user;
			if (login && password) {
				User.findOne({ login, password: md5(password) }).then(user => {
					if (user) {
						authService.generateUserToken(user._id).subscribe(token => {
							console.log(`User {login: ${user.login}} just generated a new token (login & password)`.bgCyan.black);
							subscriber.next({
								tokenType: 'Bearer',
								token
							});
						});
					} else {
						subscriber.next({
							error: true,
							message: 'Invalid login or password'
						});
					}
				});
			} else if (email && password) {
				User.findOne({ email, password: md5(password) }).then(user => {
					if (user) {
						authService.generateUserToken(user._id).subscribe(token => {
							console.log(`User {login: ${user.login}} just generated a new token (email & password)`.bgCyan.black);
							subscriber.next({
								tokenType: 'Bearer',
								token
							});
						});
					} else {
						subscriber.next({
							error: true,
							message: 'Invalid email or password'
						});
					}
				});
			} else {
				subscriber.next({
					error: true,
					message: 'All required fields are not provided (login / email, password)'
				});
			}

		});
	}


};


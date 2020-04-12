const { Observable } = require('rxjs');
const md5 = require('md5');
const colors = require('colors');

const AuthService = require('./AuthService');
const authService = new AuthService();

const LogService = require('./LogService');
const logService = new LogService();

const User = require('../models/User');

module.exports = class UsersService {

	registerUser(req) {
		return new Observable(subscriber => {

			const { login, email, password } = req.body;
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
									logService.log(`User {login: ${login}, email: ${email}} just registered`.bgYellow.black, 'registerUser', req);
									subscriber.next({ login: user.login, email: user.email });
								});
							} else {
								logService.log(`Tried to register user with {email: ${email}}`.bgRed.black, 'registerUser', req);
								subscriber.next({
									error: true,
									message: 'User with that email already exists'
								});
							}
						});
					} else {
						logService.log(`Tried to register user with {login: ${login}}`.bgRed.black, 'registerUser', req);
						subscriber.next({
							error: true,
							message: 'User with that login already exists'
						});
					}
				});
			} else {
				logService.log(`Not all fields provided {login: ${login}, email: ${email}}`.bgRed.black, 'registerUser', req);
				subscriber.next({
					error: true,
					message: 'All required fields are not provided (login, email, password)'
				});
			}

		});
	}

	createUserToken(req) {
		return new Observable(subscriber => {

			const { login, email, password } = req.body;
			if (login && password) {
				User.findOne({ login, password: md5(password) }).then(user => {
					if (user) {
						authService.generateUserToken(user._id).subscribe(token => {
							logService.log(`User {login: ${user.login}} just generated a new token (login & password)`.bgCyan.black, 'createUserToken', req);
							subscriber.next({
								tokenType: 'Bearer',
								token
							});
						});
					} else {
						logService.log(`Bad credentials for user {login: ${login}}`.bgRed.white, 'createUserToken', req);
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
							logService.log(`User {login: ${user.login}} just generated a new token (email & password)`.bgCyan.black, 'createUserToken'.req);
							subscriber.next({
								tokenType: 'Bearer',
								token
							});
						});
					} else {
						logService.log(`Bad credentials for user {email: ${email}}`.bgRed.white, 'createUserToken', req);
						subscriber.next({
							error: true,
							message: 'Invalid email or password'
						});
					}
				});
			} else {
				logService.log(`Not all fields provided {login: ${login}, email: ${email}}`.bgRed.black, 'registerUser', req);
				subscriber.next({
					error: true,
					message: 'All required fields are not provided (login / email, password)'
				});
			}

		});
	}

	checkToken(req) {
		const { token } = req.body;
		return new Observable(subscriber => {

			authService.checkUserToken(token).subscribe(response => {
				if (response === false) {
					// Token is invalid
					logService.log(`Token validation failed`.bgRed.white, 'checkToken', req);
					subscriber.next({
						valid: false
					});
				} else {
					// Token is valid
					User.findById(response._id).then(user => {
						logService.log(`Token validation passed for user {login: ${user.login}, email: ${user.email}}`.bgGreen.black, 'checkToken', req);
						subscriber.next({
							valid: true
						});
					});
				}
			});

		});
	}

	deleteUser(req) {
		return new Observable(subscriber => {

			User.findById(req.user._id).then(user => {
				user.remove().then(() => {
					subscriber.next({
						message: 'User was successfully deleted'
					});
				});
			});

		});
	}

};


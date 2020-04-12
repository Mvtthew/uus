const { Observable } = require('rxjs');
const md5 = require('md5');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

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
								}).then(() => {
									User.findOne({ login, email }).select({ password: 0 }).then(createdUser => {
										logService.log(`User {${createdUser}} just registered`.bgYellow.black, 'registerUser', req);
										subscriber.next(createdUser);
									});
								});
							} else {
								logService.log(`Tried to register user with {email: ${email}}`.bgRed.white, 'registerUser', req);
								subscriber.next({
									error: true,
									message: 'User with that email already exists'
								});
							}
						});
					} else {
						logService.log(`Tried to register user with {login: ${login}}`.bgRed.white, 'registerUser', req);
						subscriber.next({
							error: true,
							message: 'User with that login already exists'
						});
					}
				});
			} else {
				logService.log(`Not all fields provided {login: ${login}, email: ${email}}`.bgRed.white, 'registerUser', req);
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
							logService.log(`User {login: ${req.user.login}} just generated a new token (login & password)`.bgCyan.black, 'createUserToken', req);
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
							logService.log(`User {login: ${req.user.login}} just generated a new token (email & password)`.bgCyan.black, 'createUserToken'.req);
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
				logService.log(`Not all fields provided {login: ${login}, email: ${email}}`.bgRed.white, 'registerUser', req);
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
						logService.log(`Token validation passed for user {login: ${req.user.login}, email: ${req.user.email}}`.bgGreen.black, 'checkToken', req);
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

			User.findByIdAndRemove(req.user._id).then(user => {
				logService.log(`Removed user for user {login: ${req.user.login}, email: ${req.user.email}}`.bgYellow.black, 'deleteUser', req);
				subscriber.next({
					message: 'User was successfully deleted'
				});
			});

		});
	}

	// TODO
	editUser(req) { }

	addUserImage(req) {
		return new Observable(subscriber => {

			const { image } = req.files;
			if (image) {
				const alowedMaxSize = 1024 * 1024 * 5;
				if (image.size < alowedMaxSize) {
					const allowedMimetypes = [
						'image/jpeg',
						'image/jpg',
						'image/png',
						'image/gif'
					];
					if (allowedMimetypes.includes(image.mimetype)) {
						// Creating unique filename for all of users and all of images
						const fileName = md5(`${req.user._id}-profile_image-${image.name}`) + image.name.substr(image.name.length - 5);
						User.findOne(req.user._id).then(user => {
							// Unlink previous user image if he had so
							// TODO do not delete user image and reupload again if it is same image
							if (user.image) {
								fs.unlink(path.resolve(`./store/profile-images/${req.user.image}`), (err) => {
									if (err) throw err;
								});
							}
							// Upload new user image
							image.mv(path.resolve(`./store/profile-images/${fileName}`), (err) => {
								if (err) throw err;
								user.image = fileName;
								logService.log(`Uploaded profile image for user {login: ${req.user.login}} (image size: ${image.size}, image name: ${fileName})`.bgMagenta, 'addUserImage', req);
								user.save().then(() => {
									subscriber.next({
										message: 'Profile image successfully uploaded'
									});
								});
							});
						});
					} else {
						logService.log(`Tried to upload not allowed file for user {login: ${req.user.login}} (type: ${image.mimetype})`.bgRed.white, 'addUserImage', req);
						subscriber.next({
							error: true,
							message: `File needs to be image (allowed types ${allowedMimetypes})`
						});
					}
				} else {
					logService.log(`Tried to upload to big file for user {login: ${req.user.login}} (size: ${image.size})`.bgRed.white, 'addUserImage', req);
					subscriber.next({
						error: true,
						message: `File is to large (max ${alowedMaxSize / 1024 / 1024}MB)`
					});
				}
			} else {
				subscriber.next({
					error: true,
					message: 'File is required (image)'
				});
			}

		});
	}

	removeUserImage(req) {
		return new Observable(subscriber => {

			User.findOne(req.user._id).then(user => {
				if (user.image) {
					fs.unlink(path.resolve(`./store/profile-images/${req.user.image}`), (err) => {
						if (err) throw err;
						user.image = '';
						user.save().then(() => {
							logService.log(`Removed profile image for user {login: ${req.user.login}}`.bgYellow.black, 'removeUserImage', req);
							subscriber.next({
								message: 'User profile image was deleted'
							});
						});
					});
				} else {
					logService.log(`Tried to remove not existing profile image for user {login: ${req.user.login}}`.bgYellow.black, 'removeUserImage', req);
					subscriber.next({
						message: 'User does not have profile image'
					});
				}
			});

		});
	}

};


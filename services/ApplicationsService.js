const { Observable } = require('rxjs');
const { first } = require('rxjs/operators');

const LogService = require('./LogService');
const logService = new LogService();

const Application = require('../models/Application');
const User = require('../models/User');

module.exports = class ApplicationService {

	checkValidUsers(users) {
		return new Observable(subscriber => {

			let valid = true;
			let counter = 0;
			for (let i = 0; i < users.length; i++) {
				counter++;
				const userId = users[i];
				User.findById(userId).then(user => {
					if (!user) {
						subscriber.next(false);
						valid = false;
					} else {
						if (counter === users.length) {
							if (valid) {
								subscriber.next(true);
							}
						}
					}
				}).catch(err => {
					subscriber.next(false);
					valid = false;
				});
			}
		});
	}

	createNewApplication(req) {
		return new Observable(subscriber => {

			const { name, operators, permissions, defaultPermissions, defaultAttributes } = req.body;
			if (name, operators) {
				if (operators.length > 0) {
					this.checkValidUsers(operators).pipe(first()).subscribe(valid => {
						if (valid) {
							Application.findOne({ name }).then(application => {
								if (!application) {
									Application.create({ name, operators, permissions, defaultPermissions, defaultAttributes }).then(application => {
										logService.log(`Created new application ${application}`.bgGreen.white, 'createNewApplication', req);
										subscriber.next(application);
									});
								} else {
									logService.log(`Tried to create dupplicate application with name '${name}'`.bgYellow.white, 'createNewApplication', req);
									subscriber.next({
										error: true,
										message: 'Application with that name already exists'
									});
								}
							});
						} else {
							logService.log(`Tried to create application with invalid operators {name:'${name}'}`.bgYellow.white, 'createNewApplication', req);
							subscriber.next({
								error: true,
								message: 'One or more of provided operators ID\'s is/are invalid (user does not exists)'
							});
						}
					});
				} else {
					logService.log(`Tried to create application without operators {name:'${name}'}`.bgYellow.white, 'createNewApplication', req);
					subscriber.next({
						error: true,
						message: 'You need to provde at least one application operator'
					});
				}
			} else {
				subscriber.next({
					error: true,
					message: 'You need to provide all required fields (name, operators)'
				});
			}

		});
	}

	editApplication(req) {
		const { applicationId } = req.params;
		return new Observable(subscriber => {

			if (applicationId) {
				const editedApplication = req.body;
				if (editedApplication) {
					Application.findById(applicationId).then(application => {
						if (application) {
							if (application.operators.includes(req.user._id)) {
								if (editedApplication.operators) {
									if (editedApplication.operators.length > 0) {
										this.checkValidUsers(editedApplication.operators).pipe(first()).subscribe(valid => {
											if (valid) {
												application.updateOne(editedApplication).then(() => {
													Application.findById(applicationId).then(application => {
														logService.log(`User {login: '${req.user.login}'} edited application ${application}`.bgGreen.white, 'editApplication', req);
														subscriber.next(application);
													});
												}).catch(err => {
													logService.log(`User {login: '${req.user.login}'} tried to edit application ID: ${applicationId} and got error ${err}`.bgYellow.white, 'editApplication', req);
													subscriber.next({
														error: true,
														message: 'Validation error',
														errorDetails: err
													});
												});
											} else {
												logService.log(`User {login: '${req.user.login}'} tried to edit application ID: ${applicationId} and provided invalid operators`.bgYellow.white, 'editApplication', req);
												subscriber.next({
													error: true,
													message: 'One or more of provided operators ID\'s is/are invalid (user does not exists)'
												});
											}
										});
									} else {
										logService.log(`User {login: '${req.user.login}'} tried to edit application ID: ${applicationId} and not provided operators`.bgYellow.white, 'editApplication', req);
										subscriber.next({
											error: true,
											message: 'You need to provde at least one application operator'
										}); q;
									}
								} else {
									application.updateOne(editedApplication).then(() => {
										Application.findById(applicationId).then(application => {
											logService.log(`User {login: '${req.user.login}'} edited application ${application}`.bgGreen.white, 'editApplication', req);
											subscriber.next(application);
										});
									}).catch(err => {
										logService.log(`User {login: '${req.user.login}'} tried to edit application ID: ${applicationId} and got error ${err}`.bgYellow.white, 'editApplication', req);
										subscriber.next({
											error: true,
											message: 'Validation error',
											errorDetails: err
										});
									});
								}
							} else {
								logService.log(`User {login: '${req.user.login}'} tried edit application '${application}' but is not this apllication operator`.bgYellow.white, 'editApplication', req);
								subscriber.next({
									error: true,
									message: 'You are not allowed to edit this application'
								});
							}
						} else {
							subscriber.next({
								error: true,
								message: 'You need to provide valid application id'
							});
						}
					}).catch((err) => {
						subscriber.next({
							error: true,
							message: 'You need to provide valid application id'
						});
					});
				} else {
					subscriber.next({
						error: true,
						message: 'You need to provide valid application object'
					});
				}
			} else {
				subscriber.next({
					error: true,
					message: 'You need to specify application by Id'
				});
			}

		});
	}

	registerUserToApplication(req) {
		return new Observable(subscriber => {
			const { applicationId } = req.params;
			if (applicationId) {
				Application.findById(applicationId).then(application => {
					if (application) {
						// Check if user is already registered
						if (application.users.filter(applicationUser => applicationUser._uid == req.user._id).length === 0) {
							// Add user to application users array
							application.users.push({ '_uid': req.user._id, permissions: application.defaultPermissions, attributes: application.defaultAttributes });
							application.save().then(() => {
								logService.log(`User {login: '${req.user.login}'} registered to application {name: '${application.name}'}`.bgGreen.white, 'registerUserToApplication', req);
								subscriber.next({
									message: 'Successfylly registered'
								});
							});
						} else {
							logService.log(`User {login: '${req.user.login}'} tried to register to application {name: '${application.name}'} but is already registered in this application`.bgYellow.white, 'registerUserToApplication', req);
							subscriber.next({
								error: true,
								message: 'User is already registered in this application'
							});
						}
					} else {
						subscriber.next({
							error: true,
							message: 'Invalid application ID'
						});
					}
				}).catch(() => {
					subscriber.next({
						error: true,
						message: 'Invalid application ID'
					});
				});
			} else {
				subscriber.next({
					error: true,
					message: 'You need to specify application by Id'
				});
			}
		});
	}

	getAllApplicationUsers(req) {
		return new Observable(subscriber => {

			const { applicationId } = req.params;
			if (applicationId) {
				Application.findById(applicationId).then(application => {
					if (application) {
						if (application.operators.includes(req.user._id)) {
							let applicationUsers = [];
							let index = 0;
							application.users.forEach(user => {
								User.findById(user._uid).select({ password: 0, _id: 0 }).then(backUser => {
									// Throw application values (not root values)
									backUser.attributes = user.attributes;
									backUser.permissions = user.permissions;
									backUser._id = user._id;
									applicationUsers.push(backUser);
									// End ing 
									if (index === application.users.length - 1) {
										subscriber.next(applicationUsers);
									}
									index++;
								});
							});
						} else {
							subscriber.next({
								error: true,
								message: 'You are not operator of this application'
							});
						}
					} else {
						subscriber.next({
							error: true,
							message: 'You need to specify application ID'
						});
					}
				}).catch(() => {
					subscriber.next({
						error: true,
						message: 'Application with this ID does not exist'
					});
				});
			} else {
				subscriber.next({
					error: true,
					message: 'You need to specify application ID'
				});
			}

		});
	}

	getMeFromApplication(req) {
		return new Observable(subscriber => {

			const { applicationId } = req.params;
			if (applicationId) {
				Application.findById(applicationId).then(application => {
					if (application) {
						if (application.users.filter(appUser => appUser._uid == req.user._id).length > 0) {
							User.findById(req.user._id).select({ password: 0 }).then(backUser => {
								const user = application.users.filter(user => user._uid == req.user._id)[0];
								// Throw application values (not root values)
								backUser.permissions = user.permissions;
								backUser.attributes = user.attributes;
								backUser._id = user._id;
								subscriber.next(backUser);
							});
						} else {
							subscriber.next({
								error: true,
								message: 'You are not registered in this application'
							});
						}
					} else {
						subscriber.next({
							error: true,
							message: 'Application with this ID does not exist'
						});
					}
				}).catch(() => {
					subscriber.next({
						error: true,
						message: 'Application with this ID does not exist'
					});
				});
			} else {
				subscriber.next({
					error: true,
					message: 'You need to specify application ID'
				});
			}

		});
	}

};
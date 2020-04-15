const { Observable } = require('rxjs');
const { first } = require('rxjs/operators');

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

			const { name, operators, roles, defaultRoles } = req.body;
			if (name, operators) {
				if (operators.length > 0) {
					this.checkValidUsers(operators).pipe(first()).subscribe(valid => {
						if (valid) {
							Application.findOne({ name }).then(application => {
								if (!application) {
									Application.create({ name, operators, roles, defaultRoles }).then(application => {
										subscriber.next(application);
									});
								} else {
									subscriber.next({
										error: true,
										message: 'Application with that name already exists'
									});
								}
							});
						} else {
							subscriber.next({
								error: true,
								message: 'One or more of provided operators ID\'s is/are invalid (user does not exists)'
							});
						}
					});
				} else {
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
														subscriber.next(application);
													});
												}).catch(err => {
													subscriber.next({
														error: true,
														message: 'Validation error',
														errorDetails: err
													});
												});
											} else {
												subscriber.next({
													error: true,
													message: 'One or more of provided operators ID\'s is/are invalid (user does not exists)'
												});
											}
										});
									} else {
										subscriber.next({
											error: true,
											message: 'You need to provde at least one application operator'
										}); q;
									}
								} else {
									application.updateOne(editedApplication).then(() => {
										Application.findById(applicationId).then(application => {
											subscriber.next(application);
										});
									}).catch(err => {
										subscriber.next({
											error: true,
											message: 'Validation error',
											errorDetails: err
										});
									});
								}
							} else {
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
							application.users.push({ '_uid': req.user._id, roles: application.defaultRoles });
							application.save().then(() => {
								subscriber.next({
									message: 'Successfylly registered'
								});
							});
						} else {
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

};
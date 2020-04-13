const { Observable } = require('rxjs');
const { first } = require('rxjs/operators');

const Application = require('../models/Application');
const User = require('../models/User');

module.exports = class ApplicationService {

	checkValidAdmins(admins) {
		return new Observable(subscriber => {

			let valid = true;
			let counter = 0;
			for (let i = 0; i < admins.length; i++) {
				counter++;
				const adminId = admins[i];
				User.findById(adminId).then(user => {
					if (!user) {
						subscriber.next(false);
						valid = false;
					} else {
						if (counter === admins.length) {
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

			const { name, admins, permissions } = req.body;
			if (name, admins) {
				if (admins.length > 0) {
					this.checkValidAdmins(admins).pipe(first()).subscribe(valid => {
						if (valid) {
							Application.findOne({ name }).then(application => {
								if (!application) {
									Application.create({ name, admins, permissions }).then(application => {
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
								message: 'One or more of provided admins ID\'s is/are invalid (user does not exists)'
							});
						}
					});
				} else {
					subscriber.next({
						error: true,
						message: 'You need to provde at least one application admin'
					});
				}
			} else {
				subscriber.next({
					error: true,
					message: 'You need to provide all required fields (name, admins)'
				});
			}

		});
	}

	editApplication(req) {
		const applicationId = req.params.id;
		return new Observable(subscriber => {

			if (applicationId) {
				const editedApplication = req.body;
				if (editedApplication) {
					Application.findById(applicationId).then(application => {
						if (application) {
							if (application.admins.includes(req.user._id)) {
								application.updateOne(editedApplication).then(() => {
									Application.findById(applicationId).then(application => {
										subscriber.next(application);
									});
								}).catch(() => {
									subscriber.next({
										error: true,
										message: 'This application name is already taken'
									});
								});
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

};
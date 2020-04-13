const { Observable } = require('rxjs');
const { first } = require('rxjs/operators');

const Application = require('../models/Application');
const User = require('../models/User');

module.exports = class ApplicationService {

	checkAdmins(admins) {
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
			const { name, admins } = req.body;
			if (name, admins) {
				if (admins.length > 0) {
					this.checkAdmins(admins).pipe(first()).subscribe(valid => {
						if (valid) {
							Application.findOne({ name }).then(application => {
								if (!application) {
									Application.create({ name, admins }).then(application => {
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

};
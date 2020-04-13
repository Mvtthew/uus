const { Observable } = require('rxjs');

const Application = require('../models/Application');

module.exports = class ApplicationService {

	createNewApplication(req) {
		return new Observable(subscriber => {
			const { name } = req;
			if (name) {
				Application.findOne({ name }).then(application => {
					if (!application) {
						Application.create({ name }).then(application => {
							subscriber.next(application);
						});
					} else {
						subscriber.next({
							error: true,
							message: "Application with that name already exists"
						});
					}
				});
			} else {
				subscriber.next({
					error: true,
					message: 'You need to provide all required fields (name)'
				});
			}
		});
	}

};
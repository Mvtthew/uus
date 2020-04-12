const { Observable } = require('rxjs');
const jwt = require('jsonwebtoken');
const jwtOpions = require('../config/config').jwtOptions;
const jwtSecret = require('../config/config').jwtSecret;

module.exports = class AuthService {

	generateUserToken(userId) {
		return new Observable(subscriber => {

			jwt.sign({ _id: userId }, jwtSecret, (err, token) => {
				if (err) throw err;
				subscriber.next(token);
			});

		});
	}

	checkUserToken(token) {
		return new Observable(subscriber => {

			jwt.verify(token, jwtSecret, (err, decoded) => {
				if (err) {
					subscriber.next(false);
				} else {
					subscriber.next(decoded);
				}
			});

		});
	}

};
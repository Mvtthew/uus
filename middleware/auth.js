const AuthService = require('../services/AuthService');
const authService = new AuthService();

const User = require('../models/User');

module.exports = (req, res, next) => {

	const tokenHeader = req.headers.Authorization;
	if (tokenHeader) {
		const tokenType = tokenHeader.split(' ')[0];
		const token = tokenHeader.split(' ')[1];
		if (tokenType === 'Bearer') {
			authService.checkUserToken(token).subscribe(response => {
				if (response === false) {
					res.json({
						error: true,
						message: "Invalid authorization token provided"
					});
				} else {
					User.findById(response._id).then(user => {
						req.user = user;
						next();
					});
				}
			});
		} else {
			res.json({
				error: true,
				message: "Invalid authorization token type provided"
			});
		}
	} else {
		res.json({
			error: true,
			message: "Authorization token is required"
		});
	}

};
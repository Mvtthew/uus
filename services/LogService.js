const colors = require('colors');
const path = require('path');
const fs = require('fs');



module.exports = class LogService {

	log(logText, logType, req) {

		const ip = req.headers['x-forwarded-for']
			|| req.connection.remoteAddress
			|| req.socket.remoteAddress
			|| (req.connection.socket ? req.connection.socket.remoteAddress : null);

		const log = `${logType} | ${new Date().toISOString()} | ${ip} | ${logText}`;

		// Log to console
		console.log(log);

		// Lot to file
		fs.appendFileSync(path.resolve('./logs/logs.txt'), log + "\n");

	}

};
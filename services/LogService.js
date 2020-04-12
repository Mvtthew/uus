const colors = require('colors');
const path = require('path');
const fs = require('fs');



module.exports = class LogService {

	log(logText, logType, request) {

		const ip = request.headers['x-forwarded-for']
			|| request.connection.remoteAddress
			|| request.socket.remoteAddress
			|| (request.connection.socket ? request.connection.socket.remoteAddress : null);

		const log = `${logType} | ${new Date().toISOString()} | ${ip} | ${logText}`;

		// Log to console
		console.log(log);

		// Lot to file
		fs.appendFileSync(path.resolve('./logs/logs.txt'), log + "\n");

	}

};
import { Config } from "../config/Config";
import { Mongoose, ConnectionOptions } from 'mongoose';

export default class Connection {

	db: Mongoose = new Mongoose();
	connectionOptions: ConnectionOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	};

	constructor() {
		this.connect();
	}

	private connect(): void {
		this.db.connect(Config.mongoUrl, this.connectionOptions, (err) => {
			if (err) throw err;
			console.log('MongoDB connected!');
		});
	}

}
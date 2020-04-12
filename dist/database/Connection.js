"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../config/Config");
const mongoose_1 = require("mongoose");
class Connection {
    constructor() {
        this.db = new mongoose_1.Mongoose();
        this.connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        this.connect();
    }
    connect() {
        this.db.connect(Config_1.Config.mongoUrl, this.connectionOptions, (err) => {
            if (err)
                throw err;
            console.log('MongoDB connected!');
        });
    }
}
exports.default = Connection;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Connection_1 = __importDefault(require("./database/Connection"));
class App {
    constructor(controllers, port) {
        this.app = express_1.default();
        this.PORT = port;
        this.initDatabase();
        this.initMiddlewares();
        this.initControllers(controllers);
    }
    initDatabase() {
        new Connection_1.default();
    }
    initMiddlewares() {
        // Json body parser
        this.app.use(express_1.default.json());
    }
    initControllers(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.app.listen(this.PORT, () => {
            console.log(`App listening on port ${this.PORT}`);
        });
    }
}
exports.default = App;

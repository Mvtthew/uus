"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./App"));
const UsersController_1 = __importDefault(require("./controllers/UsersController"));
class Start {
    constructor() {
        this.app = new App_1.default([
            new UsersController_1.default
        ], 21000);
        this.app.listen();
    }
}
new Start();

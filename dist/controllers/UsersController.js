"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../types/Controller"));
const User_1 = __importDefault(require("../models/User"));
class UsersController extends Controller_1.default {
    constructor() {
        super();
        this.router.post('/users', (req, res) => {
            console.log(User_1.default.find().then(console.log));
        });
    }
}
exports.default = UsersController;

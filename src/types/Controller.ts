import express from "express";

export default class Controller {

	router: express.Router;

	constructor() {
		this.router = express.Router();
	}

}
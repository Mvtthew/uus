import express from "express";

export default class Controller {

	public router: express.Router;
	constructor() {
		this.router = express.Router();
	}

}
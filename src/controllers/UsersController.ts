import express from 'express';
import Controller from "../types/Controller";

export default class UsersController extends Controller {

	constructor() {
		super();

		this.router.get('/', (req, res) => {
			res.json('asd');
		});
	}



}
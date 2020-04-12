import express, { Request, Response, response } from 'express';
import { Observable } from 'rxjs';
import Controller from "../types/Controller";
import User from '../models/User';

export default class UsersController extends Controller {

	constructor() {
		super();

		this.router.post('/users', (req, res) => {
			console.log(User.find().then(console.log));
		});
	}



}
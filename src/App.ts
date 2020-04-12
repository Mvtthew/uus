import express from "express";
import Controller from "./types/Controller";
import Connection from "./database/Connection";

export default class App {

	public app: express.Application;
	public PORT: number;

	constructor(controllers: Array<Controller>, port: number) {
		this.app = express();
		this.PORT = port;

		this.initDatabase();
		this.initMiddlewares();
		this.initControllers(controllers);
	}

	private initDatabase(): void {
		new Connection();
	}

	private initMiddlewares(): void {
		// Json body parser
		this.app.use(express.json());
	}

	private initControllers(controllers: Array<Controller>): void {
		controllers.forEach(controller => {
			this.app.use('/', controller.router);
		});
	}

	public listen(): void {
		this.app.listen(this.PORT, () => {
			console.log(`App listening on port ${this.PORT}`);
		});
	}

}
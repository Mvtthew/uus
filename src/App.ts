import express from "express";
import Controller from "./models/Controller";

export default class App {

	public app: express.Application;
	public PORT: number;

	constructor(controllers: Array<Controller>, port: number) {
		this.app = express();
		this.PORT = port;

		this.initMiddlewares();
		this.initControllers(controllers);
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
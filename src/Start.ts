import App from "./App";
import UsersController from "./controllers/UsersController";

class Start {
	app: App;
	constructor() {
		this.app = new App([
			new UsersController
		], 21000);
		this.app.listen();
	}
}

new Start();
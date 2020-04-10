import App from "./App";

class Start {
	app: App;
	constructor() {
		this.app = new App([

		], 21000);
		this.app.listen();
	}
}

new Start();
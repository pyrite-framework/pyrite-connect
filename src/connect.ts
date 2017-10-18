import { makeRequest } from "./utils";

export class PyriteConnect {
	private controllers: any;
	private connect: Promise<any>;
	private plugins: Array<any> | void;

	constructor(private params: any) {
		this.connect = makeRequest(params.url);
		this.plugins = params.plugins;
	}

	public getRoutes(): Promise<any> {
		if (this.controllers) return Promise.resolve(this.controllers.controllers);

		return this.connect.then((controllersAllowed) => {
			const controllers = {
				controllers: this.buildControllers(controllersAllowed)
			};

			let promisesPlugins: Promise<void | Array<any>> = Promise.resolve();

			if (this.plugins) {
				const plugins = this.plugins.map((plugin: any) => plugin.load(this.params, controllers));
				promisesPlugins = Promise.all(plugins);
			}

			return promisesPlugins.then(() => {
				this.controllers = controllers;
				return this.controllers.controllers;
			});
		});
	}

	private buildControllers(controllersAllowed: any): void {
		const controllerNames: Array<string> = Object.keys(controllersAllowed);

		const controllers: any = {};

		controllerNames.forEach((controllerName: string): void => {
			if (!controllers[controllerName]) controllers[controllerName] = {};

			const methods: Array<string> = Object.keys(controllersAllowed[controllerName]);

			methods.forEach((methodName: string): void => {
				const config = controllersAllowed[controllerName][methodName];

				controllers[controllerName][methodName] = (params: any) => {
					if (this.plugins) {
						this.plugins.forEach((plugin: any) => plugin.run(params));
					}
					return makeRequest(this.params.url, config, params);
				};
			})
		})

		return controllers;
	}
}

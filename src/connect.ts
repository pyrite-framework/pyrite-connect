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

				controllers[controllerName][methodName] = this.buildMethod.bind(this, config);
			});
		});

		return controllers;
	}

	private buildMethod(config: any, ...attrs: Array<any>) {
		const params = {};

		if (config.params) this.buildParameters(config, params, attrs);
		if (config.storage) this.buildStorage(config, params);

		if (this.plugins) this.plugins.forEach((plugin: any) => plugin.run(params));

		return makeRequest(this.params.url, config, params);
	};

	private buildParameters(config: any, params: any, attrs: Array<any>): void {
		let totalParams = 0;

		config.params.forEach((attr: any, index: number) => {
			if (!["body", "query", "param"].includes(attr.param)) return;
			totalParams++;

			if (attr.key) {
				if (!params[attr.param]) params[attr.param] = {};
				params[attr.param][attr.key] = attrs[index];
				return;
			}

			params[attr.param] = attrs[index];
		});

		if (attrs.length > totalParams) Object.assign(params, attrs[totalParams]);
	}

	private buildStorage(config: any, params: any): void {
		if (!params.headers) params.headers = {};

		config.storage.forEach((storage: any) => {
			const storageKey = storage.local || storage.remote;
			const storageValue = sessionStorage.getItem(storageKey) || localStorage.getItem(storageKey);

			if (storageValue) params.headers[storage.remote] = storageValue;
		});
	}
}

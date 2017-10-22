import * as m from "mithril";
import * as queryString from "query-string";

export function makeRequest(host: string, methodConfig: any = {}, config: any = {}): Promise<any> {
	const url: string = methodConfig.url ? reemplaceParams(methodConfig.url, config) : "";

	const headers = config ? config.headers || {} : {};

	headers["Content-Type"] = "application/json";

	const query = reemplaceQuery(config);

	return m.request(host + url + query, {
		method: methodConfig.action || "GET",
		headers: headers,
		data: config.body
	});
}

function reemplaceQuery(config: any): string {
	return config && config.query ? "?" + queryString.stringify(config.query) : "";
};

function reemplaceParams(url: string, config: any): string {
	if (!config || !config.params) return url;

	let finalUrl: Array<string> = [];
	let routes: Array<string> = url.split("/");

	routes.forEach((route: string): any => {
		const isParam: Boolean = route[0] == ":";

		if (!isParam) return finalUrl.push(route);

		const param: string = route.substring(1, route.length);
		const finalParam: string = config.params[param];

		if (!finalParam) throw "Param not set: " + param;

		finalUrl.push(config.params[param].toString());
	});

	const result = finalUrl.join("/");

	return result;
}

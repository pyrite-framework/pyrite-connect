import "whatwg-fetch";
import * as queryString from "query-string";

export function makeRequest(host: string, methodConfig: any, config: any, emitConfig: any): Promise<any> {
    const url: string = reemplaceParams(methodConfig.url, config);

    const headers = config ? config.headers || {} : {};

    if (methodConfig.emits) {
      headers["pyrite-token"] = emitConfig.token;

      if (config && config.emit) {
        const emitTo =  Array.isArray(config.emit) ? config.emit.join('|') : config.emit;
        headers["pyrite-id"] = emitTo;
      }
    }

    headers["Content-Type"] = "application/json";

    return fetch(host + url, {
      method: methodConfig.action,
      headers: headers,
      body: config ? config.body || {} : {}
    });
}

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

  const query = config && config.query ? queryString.stringify(config.query) : "";

  return result + query;
}
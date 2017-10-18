import "whatwg-fetch";
import * as queryString from "query-string";

export function makeRequest(host: string, methodConfig: any = {}, config: any = {}): Promise<any> {
    const url: string = methodConfig ? reemplaceParams(methodConfig.url, config) : "";

    const headers = config ? config.headers || {} : {};

    // if (methodConfig.emits) {
    //   headers["pyrite-token"] = emitConfig.token;

    //   if (config && config.emit) {
    //     const emitTo =  Array.isArray(config.emit) ? config.emit.join('|') : config.emit;
    //     headers["pyrite-id"] = emitTo;
    //   }
    // }

    headers["Content-Type"] = "application/json";

    const query = reemplaceQuery(config);

    return fetch(host + url + query, {
      method: methodConfig.action || "GET",
      headers: headers,
      body: config && config.body && JSON.stringify(config.body)
    })
    .then(checkStatus);
}

function checkStatus(response: any): any {
  if (response.status >= 200 && response.status < 300) {
    return response.text().then((text: string) => {
      return text ? JSON.parse(text) : {}
    });
  } else {
    return response.text().then((text: string) => {
      throw text ? JSON.parse(text) : {}
    });
  }
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
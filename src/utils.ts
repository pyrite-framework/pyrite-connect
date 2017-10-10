export function makeRequest(host: string, methodConfig: any, config: any, emitConfig: any): Promise<any> {
    return new Promise((resolve: Function, reject: Function): void => {
        const http_request = new XMLHttpRequest();
        http_request.onreadystatechange = () => {
            if (http_request.readyState == 4) {
                const response = JSON.parse(http_request.responseText)

                if (http_request.status >= 200 && http_request.status < 300) resolve(response);
                else reject(response);
            }
        };

        const url: string = reemplaceParams(methodConfig.url, config);

        http_request.open(methodConfig.action, host + url, true);

        http_request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        if (methodConfig.emits) {
            http_request.setRequestHeader("pyrite-token", emitConfig.token);

            if (config && config.emit) {
                const emitTo =  Array.isArray(config.emit) ? config.emit.join('|') : config.emit;

                http_request.setRequestHeader("pyrite-id", emitTo);
            }
        }

        http_request.send((config && config.body) ? JSON.stringify(config.body) : null);
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

    return finalUrl.join("/");
}
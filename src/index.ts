// import * as io from "socket.io-client";
import { makeRequest } from "./utils";

type ConnectParameters = {
  url:string
};

export class Connect {
  private controllers: any;
  // private id: string;
  // private token: string;
  private connect: Promise<any>;

  constructor(private params: ConnectParameters) {
    this.connect = makeRequest(params.url);
  }

  public getRoutes(): Promise<any> {
    if (this.controllers) return Promise.resolve(this.controllers);

    this.connect.then((controllersAllowed) => {
      const controllers = {
        controllers: controllersAllowed
      };

      this.controllers = this.buildControllers(controllers);

      return this.controllers;
    });

    //const socket: SocketIOClient.Socket = io(this.params.url)

    // return new Promise((resolve, reject): void => {
    //   socket.on('controllersAllowed', (controllersAllowed: any) => {
    //     this.controllers = this.buildControllers(controllersAllowed, socket);
    //     this.id = controllersAllowed.id;
    //     this.token = controllersAllowed.token;

    //     resolve(this.controllers);
    //   });
    // });
  }

  // private createOnEvent(socket: SocketIOClient.Socket, controller: any, controllerName: string, methodName: string) {
  //   if (!controller.on) controller.on = {};
  //   if (!controller.off) controller.off = {};

  //   const eventName: string = controllerName + ".on." + methodName;

  //   let callback: Function = (): any => {};

  //   const listener: Function = (response: any): void => {
  //     callback(response.data, response.id);
  //   };

  //   controller.on[methodName] = (emitCallback: Function): void => {
  //     callback = emitCallback;
  //     socket.on(eventName, listener);
  //   };

  //   controller.off[methodName] = (): void => {
  //     socket.removeListener(eventName, listener);
  //   };
  // }

  private buildControllers(controllersAllowed: any): void {
    const controllersConfig = controllersAllowed.controllers;
    const controllerNames: Array<string> = Object.keys(controllersConfig);

    const controllers: any = {};

    controllerNames.forEach((controllerName: string): void => {
      if (!controllers[controllerName]) controllers[controllerName] = {};

      const methods: Array<string> = Object.keys(controllersConfig[controllerName]);

      methods.forEach((methodName: string): void => {
        const config = controllersConfig[controllerName][methodName];

        // if (config.emits) this.createOnEvent(socket, controllers[controllerName], controllerName, methodName);

        controllers[controllerName][methodName] = (params: any) => {
          return makeRequest(this.params.url, config, params);
        };
      })
    })

    return controllers;
  }
}


(<any> window).PyriteConnect = Connect;
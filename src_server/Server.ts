"use strict";

import * as http from 'http';
import * as url from 'url';
import Base from './Base';
import Router from './Router';
import SocketIoServer from './SocketIo/SocketIoServer';

/**
* Server
* @param router Router
*/
class Server extends Base {
    private router: Router;
    private server: http.Server;

    constructor(_router: Router) {
        super();
        this.router = _router;
    }

    //開始
    public start(): void {
        try {
            this.server = http.createServer((request: http.ServerRequest, response: http.ServerResponse) => {
                return this.onRequest(request, response);
            });
            this.server.listen(this.config.getConfig().serverPort);
            this.log.system.info("Server has started.");
            SocketIoServer.getInstance().initialize(this.server);
        } catch(e) {
            this.log.system.fatal('listen error');
            this.log.system.fatal(e);
            process.exit();
        }
    }

    //停止
    public stop(): void {
        this.server.close();
    }

    private onRequest(request: http.ServerRequest, response: http.ServerResponse): void {
        let postData = "";

        request.setEncoding("utf8");
        request.on("data", (chunk) => {
            postData += chunk;
        });

        request.on("end", () => {
            //POST のゴミを削除
            if(postData.substr(0, 1) == '"') { postData = postData.substr(1) }
            if(postData.substr(postData.length - 1) == '"') { postData = postData.substr(0, postData.length - 1) }

            this.router.route(url.parse(request.url!, true),
            request, response, postData);
        });
    }
}

export default Server;


"use strict";

import * as path from 'path';
import * as http from 'http';
import * as client from 'socket.io-client';
import Logger from '../Logger';
import Configuration from '../Configuration';
import Controller from '../Controller/Controller';
import Router from '../Router';
import Server from '../Server';

namespace Util {
    export const initLogger = (): void => {
        Logger.initialize(path.join(__dirname, "../../test_config/logConfig.json"));
    }

    export const initConfiguration = (): void => {
        Configuration.getInstance().initialize(path.join(__dirname, "../../test_config/config.json"));
    }

    export const createServer = (handler: { [key: string]: Controller }): Server => {
        Util.initLogger();
        Util.initConfiguration();
        return new Server(new Router(handler));
    }

    export const createSocketIoConnection = (): SocketIOClient.Socket => {
        let port = Configuration.getInstance().getConfig()["serverPort"];
        return client.connect('http://localhost:' + port);
    }

    export const getBody = (res: http.IncomingMessage, callback: (json: any) => void): void => {
        let body = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
            callback(JSON.parse(body));
        });
    }

    export const hashSize = (object: {}): number => {
        let size = 0;
        for(let prop in object) {
            if(object.hasOwnProperty(prop)) { size++; }
        }

        return size;
    }
}

export default Util;


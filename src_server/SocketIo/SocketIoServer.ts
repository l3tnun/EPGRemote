"use strict";

import * as http from 'http';
import * as socketio from 'socket.io';
import Base from '../Base';

class SocketIoServer extends Base {
    private static instance: SocketIoServer;
    private io: SocketIO.Server | null = null;

    public static getInstance(): SocketIoServer {
        if(!this.instance) {
            this.instance = new SocketIoServer();
        }

        return this.instance;
    }

    private constructor() { super(); }

    public initialize(server: http.Server): void {
        this.io = socketio.listen(server);

        this.log.system.info("SocketIo Server has started.");
        this.io.sockets.on("connection", (_socket: SocketIO.Socket) => {
        });
    }


    public getSockets(): SocketIO.Namespace {
        if(this.io == null) {
            throw new Error("must call SocketIoServer initialize");
        }

        return this.io.sockets;
    }
}

export default SocketIoServer;


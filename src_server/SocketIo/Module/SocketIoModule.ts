"use strict";

import Base from '../../Base';

abstract class SocketIoModule extends Base {
    protected io: SocketIO.Server;
    protected socket: SocketIO.Namespace;

    constructor(_io: SocketIO.Server, _socket: SocketIO.Namespace) {
        super();
        this.io = _io;
        this.socket = _socket;
    }

    public abstract setup(): void;
}

export default SocketIoModule;


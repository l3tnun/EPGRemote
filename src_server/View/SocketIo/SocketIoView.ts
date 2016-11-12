"use strict";

import View from '../View';
import ApiModel from '../../Model/Api/ApiModel';

abstract class SocketIoView extends View {
    protected sockets: SocketIO.Namespace;
    protected socketid: number;

    constructor (_sockets: SocketIO.Namespace) {
        super();
        this.sockets = _sockets;
    }

    public setSocketId(_socketid: number): void {
        this.socketid = _socketid;
    }

    public getModel(name: string): ApiModel {
        return <ApiModel>super.getModel(name);
    }

    public abstract execute(): void;
}

export default SocketIoView;


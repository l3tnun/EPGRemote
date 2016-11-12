"use strict";

import SocketIoView from '../SocketIoView';

class NormalApiSocketIoView extends SocketIoView {
    private modelName: string;
    private eventName: string;

    constructor (_sockets: SocketIO.Namespace, _modelName: string, _eventName: string) {
        super(_sockets);
        this.modelName = _modelName;
        this.eventName = _eventName;
    }

    public execute(): void {
        this.log.access.info("view 'NormalApiSocketIoView' was called.");

        let model = this.getModel(this.modelName);

        this.sockets.emit(this.eventName, model.getResults());
    }
}

export default NormalApiSocketIoView;


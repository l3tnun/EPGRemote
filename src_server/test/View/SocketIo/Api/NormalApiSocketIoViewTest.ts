"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import SocketIoServer from '../../../../SocketIo/SocketIoServer';
import NormalApiSocketIoView from '../../../../View/SocketIo/Api/NormalApiSocketIoView';
import DummyApiModel from './DummyApiModel';

describe('NormalApiSocketIoView', () => {
    let server: Server;

    before(() => {
        //SocketIo のためにからの Server を動かす
        server = Util.createServer({});
        server.start();
    });

    after(() => {
        server.stop();
    });

    describe('execute', () => {
        it('GET', (done) => {
            let socket = Util.createSocketIoConnection();
            socket.on('connect', () => {
                let model = new DummyApiModel();

                let sockets = SocketIoServer.getInstance().getSockets();
                let view = new NormalApiSocketIoView(sockets, "dummyModel", "dummyEvent");
                view.setModels({ "dummyModel": model });

                model.addViewEvent(view);
                model.execute();
            });

            socket.on('dummyEvent', (value: { [key: string]: any }) => {
                assert.equal(value["dummy"], "dummy");

                socket.disconnect();
                done();
            });
        });
    });
});


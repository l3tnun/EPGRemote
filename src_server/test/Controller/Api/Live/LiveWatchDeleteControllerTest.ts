"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LiveWatchDeleteController from '../../../../Controller/Api/Live/LiveWatchDeleteController';
import DummyApiModel from '../DummyApiModel';

describe('LiveWatchDeleteController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:DELETE": new LiveWatchDeleteController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("LiveWatchStopStreamModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["streamId"]);
                assert.equal(option["streamId"], 1);
            });
        });

        request.del(
            {
                url: 'http://localhost:' + port,
                qs: { stream: 1 },
                json :true
            },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LiveWatchGetController from '../../../../Controller/Api/Live/LiveWatchGetController';
import DummyApiModel from '../DummyApiModel';

describe('LiveWatchGetController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new LiveWatchGetController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("LiveWatchStreamInfoModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["streamId"]);
                assert.equal(option["streamId"], 1);
            });
        });

        http.get('http://localhost:' + port + "?stream=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


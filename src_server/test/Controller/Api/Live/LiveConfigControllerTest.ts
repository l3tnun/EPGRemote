"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LiveConfigController from '../../../../Controller/Api/Live/LiveConfigController';
import DummyApiModel from '../DummyApiModel';

describe('LiveConfigController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new LiveConfigController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("LiveConfigModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isString(option["type"]);
                assert.equal(option["type"], "GR");
            });
        });

        http.get('http://localhost:' + port + "?type=GR", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LogController from '../../../../Controller/Api/Log/LogController';
import DummyApiModel from '../DummyApiModel';

describe('LogController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new LogController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("LogModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["info"]);
                assert.equal(option["info"], 1);
                assert.isNumber(option["warning"]);
                assert.equal(option["warning"], 1);
                assert.isNumber(option["error"]);
                assert.equal(option["error"], 1);
                assert.isNumber(option["debug"]);
                assert.equal(option["debug"], 1);
            });
        });

        http.get('http://localhost:' + port + "?info=1&warning=1&error=1&debug=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LiveProgramController from '../../../../Controller/Api/Live/LiveProgramController';
import DummyApiModel from '../DummyApiModel';

describe('LiveProgramController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new LiveProgramController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option1', (done) => {
        //dummy model をセット
        modelFactory.add("LiveProgramModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isString(option["type"]);
                assert.equal(option["type"], "GR");
                assert.isNumber(option["time"]);
                assert.equal(option["time"], 0);
            });
        });

        http.get('http://localhost:' + port + "?type=GR", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('check option2', (done) => {
        //dummy model をセット
        modelFactory.add("LiveProgramModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isString(option["type"]);
                assert.equal(option["type"], "GR");
                assert.isNumber(option["time"]);
                assert.equal(option["time"], 10);
            });
        });

        http.get('http://localhost:' + port + "?type=GR&time=10", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


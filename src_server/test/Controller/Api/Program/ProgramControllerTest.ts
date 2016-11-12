"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ProgramController from '../../../../Controller/Api/Program/ProgramController';
import DummyApiModel from '../DummyApiModel';

describe('ProgramController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new ProgramController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ProgramModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isString(option["type"]);
                assert.equal(option["type"], "GR");
                assert.isString(option["time"]);
                assert.equal(option["time"], "20160101");
                assert.isNumber(option["length"]);
                assert.equal(option["length"], 1);
                assert.isString(option["ch"]);
                assert.equal(option["ch"], "Dummy_channel");
            });
        });

        http.get('http://localhost:' + port + "?type=GR&time=20160101&length=1&ch=Dummy_channel", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


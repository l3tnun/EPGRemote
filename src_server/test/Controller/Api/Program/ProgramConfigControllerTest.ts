"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ProgramConfigController from '../../../../Controller/Api/Program/ProgramConfigController';
import DummyApiModel from '../DummyApiModel';

describe('ProgramConfigController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new ProgramConfigController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ProgramConfigModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.equal(Util.hashSize(option), 0);
            });
        });

        http.get('http://localhost:' + port, (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


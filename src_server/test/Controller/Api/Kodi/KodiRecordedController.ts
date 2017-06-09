"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import KodiRecordedController from '../../../../Controller/Api/Kodi/KodiRecordedController';
import DummyApiModel from '../DummyApiModel';

describe('KodiRecordedController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new KodiRecordedController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("KodiRecordedModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["length"]);
                assert.equal(option["length"], 1);
                assert.isNumber(option["asc"]);
                assert.equal(option["asc"], 1);
            });
        });

        http.get('http://localhost:' + port + "?length=1&asc=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


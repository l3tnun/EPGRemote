"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import RecordedVideoGetController from '../../../../Controller/Api/Recorded/RecordedVideoGetController';
import DummyApiModel from '../DummyApiModel';

describe('RecordedVideoGetController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new RecordedVideoGetController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("RecordedVideoPathModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["rec_id"]);
                assert.equal(option["rec_id"], 1);
                assert.isNumber(option["ios"]);
                assert.equal(option["ios"], 1);
            });
        });

        http.get('http://localhost:' + port + "?rec_id=1&ios=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


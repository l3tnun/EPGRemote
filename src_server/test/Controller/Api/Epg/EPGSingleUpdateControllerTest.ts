"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import EPGSingleUpdateController from '../../../../Controller/Api/Epg/EPGSingleUpdateController';
import DummyApiModel from '../DummyApiModel';

describe('EPGSingleUpdateController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new EPGSingleUpdateController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("EPGSingleUpdateModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isString(option["channel_disc"]);
                assert.equal(option["channel_disc"], "Dummy_channel");
            });
        });

        http.get('http://localhost:' + port + "?channel_disc=Dummy_channel", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


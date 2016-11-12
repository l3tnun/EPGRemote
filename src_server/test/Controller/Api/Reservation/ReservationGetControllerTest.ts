"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ReservationGetController from '../../../../Controller/Api/Reservation/ReservationGetController';
import DummyApiModel from '../DummyApiModel';

describe('ReservationGetController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new ReservationGetController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ReservationModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["page"]);
                assert.equal(option["page"], 1);
                assert.isNumber(option["limit"]);
                assert.equal(option["limit"], 1);
            });
        });

        http.get('http://localhost:' + port + "?page=1&limit=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


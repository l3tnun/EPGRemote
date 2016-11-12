"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ReservationDeleteController from '../../../../Controller/Api/Reservation/ReservationDeleteController';
import DummyApiModel from '../DummyApiModel';

describe('ReservationDeleteController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:DELETE": new ReservationDeleteController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ReservationCancelRecModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["rec_id"]);
                assert.equal(option["rec_id"], 1);
                assert.isNumber(option["autorec"]);
                assert.equal(option["autorec"], 1);
            });
        });

        request.del(
            {
                url: 'http://localhost:' + port,
                qs: {
                    rec_id: 1,
                    autorec: 1
                },
                json :true
            },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


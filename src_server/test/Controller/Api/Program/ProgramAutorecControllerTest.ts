"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ProgramAutorecController from '../../../../Controller/Api/Program/ProgramAutorecController';
import DummyApiModel from '../DummyApiModel';

describe('ProgramAutorecController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:PUT": new ProgramAutorecController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ProgramAutorecModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["program_id"]);
                assert.equal(option["program_id"], 1);
                assert.isNumber(option["autorec"]);
                assert.equal(option["autorec"], 1);
            });
        });

        request.put(
            'http://localhost:' + port,
            { form: {
                program_id: 1,
                autorec: 1
            } },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


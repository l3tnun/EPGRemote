"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import KeywordPutController from '../../../../Controller/Api/Keyword/KeywordPutController';
import DummyApiModel from '../DummyApiModel';

describe('KeywordPutController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:PUT": new KeywordPutController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("KeywordEnableModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["keyword_id"]);
                assert.equal(option["keyword_id"], 1);
                assert.isNumber(option["status"]);
                assert.equal(option["status"], 1);
            });
        });

        request.put(
            'http://localhost:' + port,
            { form: {
                keyword_id: 1,
                status: 1
            } },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


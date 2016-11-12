"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import KeywordDeleteController from '../../../../Controller/Api/Keyword/KeywordDeleteController';
import DummyApiModel from '../DummyApiModel';

describe('KeywordDeleteController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:DELETE": new KeywordDeleteController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("KeywordDeleteModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["keyword_id"]);
                assert.equal(option["keyword_id"], 1);
            });
        });

        request.del(
            {
                url: 'http://localhost:' + port,
                qs: { keyword_id: 1 },
                json :true
            },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


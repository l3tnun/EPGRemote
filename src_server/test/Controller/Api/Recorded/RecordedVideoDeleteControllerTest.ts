"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as  http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import RecordedVideoDeleteController from '../../../../Controller/Api/Recorded/RecordedVideoDeleteController';
import DummyApiModel from '../DummyApiModel';

describe('RecordedVideoDeleteController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:DELETE": new RecordedVideoDeleteController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("RecordedDeleteVideoModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["rec_id"]);
                assert.equal(option["rec_id"], 1);
                assert.isNumber(option["delete_file"]);
                assert.equal(option["delete_file"], 1);
            });
        });

        request.del(
            {
                url: 'http://localhost:' + port,
                qs: {
                    rec_id: 1,
                    delete_file: 1
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


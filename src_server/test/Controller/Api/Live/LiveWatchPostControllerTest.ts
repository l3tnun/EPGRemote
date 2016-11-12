"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import LiveWatchPostController from '../../../../Controller/Api/Live/LiveWatchPostController';
import DummyApiModel from '../DummyApiModel';

describe('LiveWatchPostController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:POST": new LiveWatchPostController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    describe('新規配信', () => {
        it('ライブ視聴', (done) => {
            //dummy model をセット
            modelFactory.add("LiveWatchStartStreamModel", () => {
                return new DummyApiModel((option: { [key: string]: any }) => {
                    assert.isString(option["channel"]);
                    assert.equal(option["channel"], "channel");
                    assert.isString(option["sid"]);
                    assert.equal(option["sid"], "sid");
                    assert.isNumber(option["tunerId"]);
                    assert.equal(option["tunerId"], 1);
                    assert.isNumber(option["videoId"]);
                    assert.equal(option["videoId"], 1);
                });
            });


            request.post(
                'http://localhost:' + port,
                { form: {
                    channel: "channel",
                    sid: "sid",
                    tuner: 1,
                    video: 1
                } },
                (_err: any, _res: http.IncomingMessage, _body: any) => {
                    assert.equal(200, _res.statusCode);
                    done();
                }
            );
        });

        it('録画配信', (done) => {
            //dummy model をセット
            modelFactory.add("RecordedWatchStartStreamModel", () => {
                return new DummyApiModel((option: { [key: string]: any }) => {
                    assert.isNumber(option["id"]);
                    assert.equal(option["id"], 1);
                    assert.isString(option["type"]);
                    assert.equal(option["type"], "GR");
                    assert.isNumber(option["videoId"]);
                    assert.equal(option["videoId"], 1);
                });
            });

            request.post(
                'http://localhost:' + port,
                { form: {
                    channel: "channel",
                    id: 1,
                    type: "GR",
                    video: 1
                } },
                (_err: any, _res: http.IncomingMessage, _body: any) => {
                    assert.equal(200, _res.statusCode);
                    done();
                }
            );
        });
    });

    describe('配信変更', () => {
        it('ライブ変更', (done) => {
            //dummy model をセット
            modelFactory.add("LiveWatchChangeStreamModel", () => {
                return new DummyApiModel((option: { [key: string]: any }) => {
                    assert.isNumber(option["streamId"]);
                    assert.equal(option["streamId"], 1);
                    assert.isString(option["channel"]);
                    assert.equal(option["channel"], "channel");
                    assert.isString(option["sid"]);
                    assert.equal(option["sid"], "sid");
                    assert.isNumber(option["tunerId"]);
                    assert.equal(option["tunerId"], 1);
                    assert.isNumber(option["videoId"]);
                    assert.equal(option["videoId"], 1);
                });
            });

            request.post(
                'http://localhost:' + port,
                { form: {
                    stream: 1,
                    channel: "channel",
                    sid: "sid",
                    tuner: 1,
                    video: 1
                } },
                (_err: any, _res: http.IncomingMessage, _body: any) => {
                    assert.equal(200, _res.statusCode);
                    done();
                }
            );
        });
    });
});


"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import KeywordGetController from '../../../../Controller/Api/Keyword/KeywordGetController';
import DummyApiModel from '../DummyApiModel';

describe('KeywordGetController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new KeywordGetController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option1', (done) => {
        //dummy model をセット
        modelFactory.add("KeywordModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["keyword_id"]);
                assert.equal(option["keyword_id"], 1);
            });
        });

        //keyword_id 指定
        http.get('http://localhost:' + port + "?keyword_id=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('check option2', (done) => {
        //dummy model をセット
        modelFactory.add("KeywordModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["page"]);
                assert.equal(option["page"], 1);
                assert.isNumber(option["limit"]);
                assert.equal(option["limit"], 1);
            });
        });

        //page & limit 指定
        http.get('http://localhost:' + port + "?page=1&limit=1", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


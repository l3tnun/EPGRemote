"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import RecordedCategoryListController from '../../../../Controller/Api/Recorded/RecordedCategoryListController';
import DummyApiModel from '../DummyApiModel';

describe('RecordedCategoryListController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:GET": new RecordedCategoryListController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("RecordedCategoryListModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["autorec"]);
                assert.equal(option["autorec"], 1);
                assert.isNumber(option["category_id"]);
                assert.equal(option["category_id"], 1);
                assert.isNumber(option["channel_id"]);
                assert.equal(option["channel_id"], 1);
                assert.isString(option["search"]);
                assert.equal(option["search"], "search");
            });
        });

        http.get('http://localhost:' + port + "?keyword_id=1&category_id=1&channel_id=1&search=search", (res) => {
            assert.equal(200, res.statusCode);
            done();
        });
    });
});


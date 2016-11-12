"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import KeywordPostController from '../../../../Controller/Api/Keyword/KeywordPostController';
import DummyApiModel from '../DummyApiModel';

describe('KeywordPostController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:POST": new KeywordPostController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("KeywordAddModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                checkValue(option, "keyword_id", 1);
                checkValue(option, "keyword", "keyword");
                checkValue(option, "use_regexp", 1);
                checkValue(option, "collate_ci", 1);
                checkValue(option, "ena_title", 1);
                checkValue(option, "ena_desc", 1);
                checkValue(option, "typeGR", 1);
                checkValue(option, "typeBS", 1);
                checkValue(option, "typeCS", 1);
                checkValue(option, "typeEX", 1);
                checkValue(option, "channel_id", 1);
                checkValue(option, "category_id", 1);
                checkValue(option, "sub_genre", 1);
                checkValue(option, "first_genre", 1);
                checkValue(option, "prgtime", 1);
                checkValue(option, "period", 1);
                checkValue(option, "week0", 1);
                checkValue(option, "week1", 1);
                checkValue(option, "week2", 1);
                checkValue(option, "week3", 1);
                checkValue(option, "week4", 1);
                checkValue(option, "week5", 1);
                checkValue(option, "week6", 1);
                checkValue(option, "kw_enable", 1);
                checkValue(option, "overlap", 1);
                checkValue(option, "rest_alert", 1);
                checkValue(option, "criterion_dura", 1);
                checkValue(option, "discontinuity", 1);
                checkValue(option, "sft_start", "1");
                checkValue(option, "sft_end", "1");
                checkValue(option, "split_time", 1);
                checkValue(option, "priority", 1);
                checkValue(option, "autorec_mode", 1);
                checkValue(option, "directory", "directory");
                checkValue(option, "filename_format", "filename_format");
                checkValue(option, "trans_mode0", 1);
                checkValue(option, "transdir0", "transdir0");
                checkValue(option, "trans_mode1", 1);
                checkValue(option, "transdir1", "transdir1");
                checkValue(option, "trans_mode2", 1);
                checkValue(option, "transdir2", "transdir2");
                checkValue(option, "ts_del", 1);
            });
        });

        request.post(
            'http://localhost:' + port,
            { form: {
                keyword_id:         1,
                keyword:            "keyword",
                use_regexp:         1,
                collate_ci:         1,
                ena_title:          1,
                ena_desc:           1,
                typeGR:             1,
                typeBS:             1,
                typeCS:             1,
                typeEX:             1,
                channel_id:         1,
                category_id:        1,
                sub_genre:          1,
                first_genre:        1,
                prgtime:            1,
                period:             1,
                week0:              1,
                week1:              1,
                week2:              1,
                week3:              1,
                week4:              1,
                week5:              1,
                week6:              1,
                kw_enable:          1,
                overlap:            1,
                rest_alert:         1,
                criterion_dura:     1,
                discontinuity:      1,
                sft_start:          "1",
                sft_end:            "1",
                split_time:         1,
                priority:           1,
                autorec_mode:       1,
                directory:          "directory",
                filename_format:    "filename_format",
                trans_mode0:        1,
                transdir0:          "transdir0",
                trans_mode1:        1,
                transdir1:          "transdir1",
                trans_mode2:        1,
                transdir2:          "transdir2",
                ts_del:             1
            } },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });

    let checkValue = (option: { [key: string]: any }, name: string, value: number | string) => {
        if(typeof value == "number") {
            assert.isNumber(option[name]);
        } else {
            assert.isString(option[name]);
        }
        assert.equal(option[name], value);
    }
});


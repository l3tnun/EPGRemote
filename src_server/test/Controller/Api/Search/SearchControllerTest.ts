"use strict";

import * as request from 'request';
import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import SearchController from '../../../../Controller/Api/Search/SearchController';
import DummyApiModel from '../DummyApiModel';

describe('SearchController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:POST": new SearchController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("SearchModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                checkValue(option, "search", "search");
                checkValue(option, "use_regexp", 1);
                checkValue(option, "collate_ci", 1);
                checkValue(option, "ena_title", 1);
                checkValue(option, "ena_desc", 1);
                checkValue(option, "channel_id", 1);
                checkValue(option, "typeGR", 1);
                checkValue(option, "typeBS", 1);
                checkValue(option, "typeCS", 1);
                checkValue(option, "typeEX", 1);
                checkValue(option, "category_id", 1);
                checkValue(option, "first_genre", 1);
                checkValue(option, "sub_genre", 1);
                checkValue(option, "prgtime", 1);
                checkValue(option, "period", 1);
                checkValue(option, "week0", 1);
                checkValue(option, "week1", 1);
                checkValue(option, "week2", 1);
                checkValue(option, "week3", 1);
                checkValue(option, "week4", 1);
                checkValue(option, "week5", 1);
                checkValue(option, "week6", 1);
            });
        });

        request.post(
            'http://localhost:' + port,
            { form: {
                search:         "search",
                use_regexp:     1,
                collate_ci:     1,
                ena_title:      1,
                ena_desc:       1,
                channel_id:     1,
                typeGR:         1,
                typeBS:         1,
                typeCS:         1,
                typeEX:         1,
                category_id:    1,
                first_genre:    1,
                sub_genre:      1,
                prgtime:        1,
                period:         1,
                week0:          1,
                week1:          1,
                week2:          1,
                week3:          1,
                week4:          1,
                week5:          1,
                week6:          1
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


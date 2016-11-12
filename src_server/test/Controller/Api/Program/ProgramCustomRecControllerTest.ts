"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ProgramCustomRecController from '../../../../Controller/Api/Program/ProgramCustomRecController';
import DummyApiModel from '../DummyApiModel';

describe('ProgramCustomRecController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:PUT": new ProgramCustomRecController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ProgramCustomRecModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                checkValue(option, "program_id", 1);
                checkValue(option, "syear", 2016);
                checkValue(option, "smonth", 1);
                checkValue(option, "sday", 1);
                checkValue(option, "shour", 1);
                checkValue(option, "smin", 1);
                checkValue(option, "ssec", 1);
                checkValue(option, "eyear", 2016);
                checkValue(option, "emonth", 1);
                checkValue(option, "eday", 1);
                checkValue(option, "ehour", 1);
                checkValue(option, "emin", 1);
                checkValue(option, "esec", 1);
                checkValue(option, "channel_id", 1);
                checkValue(option, "record_mode", 1);
                checkValue(option, "title", "title");
                checkValue(option, "description", "description");
                checkValue(option, "discontinuity", 1);
                checkValue(option, "priority", 1);
                checkValue(option, "ts_del", 1);
            });
        });

        request.put(
            'http://localhost:' + port,
            { form: {
                program_id:     1,
                syear:          2016,
                smonth:         1,
                sday:           1,
                shour:          1,
                smin:           1,
                ssec:           1,
                eyear:          2016,
                emonth:         1,
                eday:           1,
                ehour:          1,
                emin:           1,
                esec:           1,
                channel_id:     1,
                record_mode:    1,
                title:          "title",
                description:    "description",
                discontinuity:  1,
                priority:       1,
                ts_del:         1
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


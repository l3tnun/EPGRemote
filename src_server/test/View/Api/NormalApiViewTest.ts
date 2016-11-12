"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../Util';
import Configuration from '../../../Configuration';
import Server from '../../../Server';
import DummyNormalApiViewTController from './DummyNormalApiViewTController';
import DummyApiModel from './DummyApiModel';
import DummyErrorApiModel from './DummyErrorApiModel';

describe('NormalApiView', () => {
    let server: Server;
    let port: number;

    before(() => {
        server = Util.createServer({
            "/normalApi1:GET": new DummyNormalApiViewTController(new DummyApiModel()),
            "/normalApi2:GET": new DummyNormalApiViewTController(new DummyErrorApiModel(415)),
            "/normalApi3:GET": new DummyNormalApiViewTController(new DummyErrorApiModel(500)),
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    describe('GET', () => {
        it('200', (done) => {
            http.get(getUrl("/normalApi1"), (res) => {
                assert.equal(200, res.statusCode);

                Util.getBody(res, (json) => {
                    assert.equal(json["dummy"], "dummy");
                    done();
                });
            });
        });

        it('415', (done) => {
            http.get(getUrl("/normalApi2"), (res) => {
                assert.equal(415, res.statusCode);

                Util.getBody(res, (json) => {
                    assert.isDefined(json["error"]);
                    done();
                });
            });
        });

        it('500', (done) => {
            http.get(getUrl("/normalApi3"), (res) => {
                assert.equal(500, res.statusCode);

                Util.getBody(res, (json) => {
                    assert.isDefined(json["error"]);
                    done();
                });
            });
        });
    });

    let getUrl = (ad: string) => {
        return 'http://localhost:' +  port + ad;
    }
});


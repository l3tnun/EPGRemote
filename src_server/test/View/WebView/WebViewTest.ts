"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../../Util';
import Configuration from '../../../Configuration';
import Server from '../../../Server';
import TopPageController from '../../../Controller/TopPageController';
import NotFoundController from '../../../Controller/NotFoundController';
import BadRequestController from '../../../Controller/BadRequestController';

describe('WebView', () => {
    let server: Server;
    let port: number;

    before(() => {
        server = Util.createServer({
            "/:GET": new TopPageController(),
            "/_not_found:GET": new NotFoundController(),
            "/_bad_request:GET": new BadRequestController()
        });
        server.start();
        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    describe('TopPage View & Controller', () => {
        it('return 200', (done) => {
            http.get(getUrl("/"), (res) => {
                assert.equal(200, res.statusCode);
                done();
            });

        });
    });

    describe('BadRequest View & Controller', () => {
        it('return 400', (done) => {
            http.get(getUrl("/_bad_request"), (res) => {
                assert.equal(400, res.statusCode);
                done();
            });

        });
    });

    describe('NotFound View & Controller', () => {
        it('return 404', (done) => {
            http.get(getUrl("/_not_found"), (res) => {
                assert.equal(404, res.statusCode);
                done();
            });

        });
    });

    let getUrl = (ad: string) => {
        return 'http://localhost:' + port + ad;
    }
});


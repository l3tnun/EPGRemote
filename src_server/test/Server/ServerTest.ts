"use strict";

import * as http from 'http';
import * as chai from 'chai';
const assert = chai.assert;
import Util from '../Util';
import Controller from '../../Controller/Controller';
import dummyController from './dummyController';
import Router from '../../Router';
import Server from '../../Server';
import Configuration from '../../Configuration';
import ConfigInterface from '../../ConfigInterface';

describe('Server', () => {
    let handle: { [key: string]: Controller };
    let server: Server;
    let config: ConfigInterface;

    before(() => {
        Util.initLogger();
        config = Configuration.getInstance().getConfig();
        handle = {
            "_not_found": new dummyController(404),
            "_bad_request": new dummyController(400),
            "_spcified_file": new dummyController(200),
            "/:GET": new dummyController(200)
        }
    });

    describe('server: start', () => {
        it('Server を開始する', () => {
            assert.doesNotThrow(() => {
                server = new Server(new Router(handle));
                server.start();
            });
        });
    });

    describe('route: /', () => {
        it('return 200', (done) => {
            http.get('http://localhost:' + config.serverPort, (res) => {
                assert.equal(200, res.statusCode);
                done();
            });

        });
    });

    describe('route: not found', () => {
        it('return 200', (done) => {
            http.get('http://localhost:' + config.serverPort + "/non", (res) => {
                assert.equal(404, res.statusCode);
                done();
            });

        });
    });

    describe('route: bad request', () => {
        it('return 400', (done) => {
            http.get('http://localhost:' + config.serverPort + "?a=1&a=1", (res) => {
                assert.equal(400, res.statusCode);
                done();
            });

        });
    });

    describe('route: spcified file', () => {
        it('return 200', (done) => {
            http.get('http://localhost:' + config.serverPort + "/dummy.mp4", (res) => {
                assert.equal(200, res.statusCode);
                done();
            });
        });
    });

    describe('server: stop', () => {
        it('Server を停止する', () => {
            assert.doesNotThrow(() => { server.stop(); });
        });
    });
});


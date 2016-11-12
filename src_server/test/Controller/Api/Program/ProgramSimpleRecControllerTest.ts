"use strict";

import * as request from 'request';
import * as chai from 'chai';
import * as http from 'http';
const assert = chai.assert;
import Util from '../../../Util';
import Server from '../../../../Server';
import Configuration from '../../../../Configuration';
import ModelFactory from '../../../../Model/ModelFactory';
import ProgramSimpleRecController from '../../../../Controller/Api/Program/ProgramSimpleRecController';
import DummyApiModel from '../DummyApiModel';

describe('ProgramSimpleRecController', () => {
    let server: Server;
    let modelFactory: ModelFactory;
    let port: number;

    before(() => {
        modelFactory = ModelFactory.getInstance()

        server = Util.createServer({
            "/:PUT": new ProgramSimpleRecController()
        });
        server.start();

        port = Configuration.getInstance().getConfig()["serverPort"];
    });

    after(() => {
        server.stop();
    });

    it('check option', (done) => {
        //dummy model をセット
        modelFactory.add("ProgramSimpleRecModel", () => {
            return new DummyApiModel((option: { [key: string]: any }) => {
                assert.isNumber(option["program_id"]);
                assert.equal(option["program_id"], 1);
            });
        });

        request.put(
            'http://localhost:' + port,
            { form: {
                program_id: 1
            } },
            (_err: any, _res: http.IncomingMessage, _body: any) => {
                assert.equal(200, _res.statusCode);
                done();
            }
        );
    });
});


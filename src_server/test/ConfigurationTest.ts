"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import * as fs from 'fs';
import * as path from 'path';
import Util from './Util';
import Configuration from '../Configuration';

describe('Configuration', () => {
    let config: Configuration;

    before(() => {
        Util.initLogger();
        Util.initConfiguration();
    });

    describe('getInstance', () => {
        it('インスタンスの取得', () => {
            assert.doesNotThrow(() => {
                config = Configuration.getInstance();
            });
        });
    });

    describe('getRootPath', () => {
        it('root path を取得する', () => {
            assert.equal(config.getRootPath(), path.join(__dirname, '..'));
        });
    });

    describe('getConfig', () => {
        it('config を取得する', () => {
            let configFile = fs.readFileSync(path.join(__dirname, "../../test_config/config.json"), "utf-8");
            let con = JSON.parse(configFile);

            assert.equal(JSON.stringify(con), JSON.stringify(config.getConfig()));
        });
    });
});


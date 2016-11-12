"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import Util from './Util';
import Logger from '../Logger';

describe('Logger', () => {
    before(() => {
        Util.initLogger();
    });

    describe('getLogger', () => {
        it('log を取得する', () => {
            assert.doesNotThrow(() => { Logger.getLogger(); });
        });
    });
});


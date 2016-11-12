"use strict";

import * as chai from 'chai';
const assert = chai.assert;
import StreamStatus from '../../Stream/StreamStatus';

describe('StreamStatus', () => {
    describe('new', () => {
        it('メソッドの初期値をチェック', () => {
            let stream = new StreamStatus();

            assert.isNull(stream.stream);
            assert.isFalse(stream.viewStatus);
            assert.isTrue(stream.changeChannelStatus);
        });
    });
});


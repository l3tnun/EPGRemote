"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { LiveWatchVideoModelInterface } from '../../../Model/LiveWatchVideo/LiveWatchVideoModel';

/*
* ストリームが再生可能になったら呼ばれる
*/
class EnableStreamSocketIoModule extends SocketIoModule {
    private liveWatchVideoModel: LiveWatchVideoModelInterface;

    public getName(): string { return "enableLiveStream"; }

    public getEventName(): string[] {
        return [
            "enableLiveStream"
        ];
    }

    constructor(_liveWatchVideoModel: LiveWatchVideoModelInterface) {
        super();
        this.liveWatchVideoModel = _liveWatchVideoModel;
    }

    public execute(option: { [key: string]: any; }): void {
        let streamNumber = m.route.param("stream");

        if(typeof streamNumber != "undefined" && option["streamNumber"] == Number(streamNumber)) {
            this.liveWatchVideoModel.show();
        }
    }
}

export default EnableStreamSocketIoModule;


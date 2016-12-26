"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { LiveOtherStreamInfoApiModelInterface } from '../../../Model/Api/Live/LiveOtherStreamInfoApiModel';

/*
* ストリーム情報がサーバで更新されると呼ばれる
* LiveOtherStreamInfoApiModel を更新する
*/
class LiveRefreshStreamSocketIoModule extends SocketIoModule {
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;

    constructor(_LiveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface) {
        super();
        this.liveOtherStreamInfoApiModel = _LiveOtherStreamInfoApiModel;
    }

    public getName(): string { return "refreshLiveStream"; }

    public getEventName(): string[] {
        return [
            "refreshLiveStream"
        ];
    }

    public execute(option: { [key: string]: any; }): void {
        let streamNumber = m.route.param("stream");

        if(typeof streamNumber != "undefined" && option["streamNumber"] == Number(streamNumber)) {
            if(option["status"] == 'change') { m.route(m.route()); }
        }

        this.liveOtherStreamInfoApiModel.update();
    }
}

export default LiveRefreshStreamSocketIoModule;


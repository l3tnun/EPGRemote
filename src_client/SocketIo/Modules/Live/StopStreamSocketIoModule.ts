"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { LiveOtherStreamInfoApiModelInterface } from '../../../Model/Api/Live/LiveOtherStreamInfoApiModel';

/*
* stream が停止すると呼ばれる
* 該当 stream ページにいた場合 '/' に移動する
*/
class StopStreamSocketIoModule extends SocketIoModule {
    private lveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;

    constructor(_lveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface) {
        super();
        this.lveOtherStreamInfoApiModel = _lveOtherStreamInfoApiModel;
    }

    public getName(): string { return "stopLiveStream"; }

    public getEventName(): string[] {
        return [
            "stopLiveStream"
        ];
    }

    public execute(option: { [key: string]: any; }): void {
        this.lveOtherStreamInfoApiModel.update();

        let streamNumber = m.route.param("stream");

        if(typeof streamNumber != "undefined" && option["streamNumber"] == Number(streamNumber)) {
            m.route('/');
        }
    }
}

export default StopStreamSocketIoModule;


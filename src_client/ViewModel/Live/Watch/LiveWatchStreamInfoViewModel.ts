"use strict";

import * as m from 'mithril';
import ViewModel from '../../ViewModel';
import { LiveWatchStreamInfoApiModelInterface } from '../../../Model/Api/Live/Watch/LiveWatchStreamInfoApiModel';

/**
* LiveWatchStreamInfo の ViewModel
*/
class LiveWatchStreamInfoViewModel extends ViewModel {
    private liveWatchStreanInfoApiModel: LiveWatchStreamInfoApiModelInterface;

    constructor(_liveWatchStreanInfoApiModel: LiveWatchStreamInfoApiModelInterface) {
        super();

        this.liveWatchStreanInfoApiModel = _liveWatchStreanInfoApiModel;
    }

    //初期化処理
    public init(): void {
        if(m.route.param("stream") == null && m.route.param("channel") == null) { return; }
        setTimeout(() => { this.liveWatchStreanInfoApiModel.update(); }, 500);
    }

    //stream 情報を返す
    public getInfo(): { [key: string]: any } {
        return this.liveWatchStreanInfoApiModel.getInfo();
    }
}

export default LiveWatchStreamInfoViewModel;


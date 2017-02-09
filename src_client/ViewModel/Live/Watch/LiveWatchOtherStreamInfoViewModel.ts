"use strict";

import * as m from 'mithril';
import ViewModel from '../../ViewModel';
import { LiveOtherStreamInfoApiModelInterface } from '../../../Model/Api/Live/LiveOtherStreamInfoApiModel';

/**
* LiveWatchStreamInfo の ViewModel
*/
class LiveWatchOtherStreamInfoViewModel extends ViewModel {
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;

    constructor(_liveOtherModel: LiveOtherStreamInfoApiModelInterface) {
        super();

        this.liveOtherStreamInfoApiModel = _liveOtherModel;
    }

    //this.streamId 以外の stream 情報を返す
    public getOtherStreamInfo(): any[] {
        let info = this.liveOtherStreamInfoApiModel.getList();

        let streamId = m.route.param("stream") == null ? null : Number(m.route.param("stream"))
        if(streamId == null) { return info; }

        let result: any[] = [];

        info.map((data) => {
            if(data["streamNumber"] == streamId) { return; }
            result.push(data);
        });

        return result;
    }
}

export default LiveWatchOtherStreamInfoViewModel;


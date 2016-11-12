"use strict";

import ViewModel from '../ViewModel';
import { BroadCastApiModelInterface } from '../../Model/Api/BroadCastApiModel';
import { LiveOtherStreamInfoApiModelInterface } from '../../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';

/**
* Navigation の ViewModel
*/
class NavigationViewModel extends ViewModel {
    private broadCastApiModel: BroadCastApiModelInterface;
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;

    constructor(
        _broadCast: BroadCastApiModelInterface,
        _liveOtherModel: LiveOtherStreamInfoApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface
    ) {
        super();

        this.broadCastApiModel = _broadCast;
        this.liveOtherStreamInfoApiModel = _liveOtherModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
    }

    public init(): void {
        this.broadCastApiModel.update();
        this.liveOtherStreamInfoApiModel.update();
        this.liveConfigEnableApiModel.update();
    }

    //有効な放送波を返す
    public getBroadCastList(): string[] {
        return this.broadCastApiModel.getList();
    }

    //配信中のストリーム情報を返す
    public getLiveOtherStreamInfoList(): any[] {
        return this.liveOtherStreamInfoApiModel.getList();
    }

    /**
    * ライブ配信が有効か返す
    * 有効 true, 無効 false
    */
    public enableLive(): boolean {
        return this.liveConfigEnableApiModel.getLive();
    }

    /**
    * 録画配信が有効か返す
    * 有効 true, 無効 false
    */
    public enableRecorded(): boolean {
        return this.liveConfigEnableApiModel.getRecorded();
    }
}

export default NavigationViewModel;


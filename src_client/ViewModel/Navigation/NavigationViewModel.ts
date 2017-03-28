"use strict";

import ViewModel from '../ViewModel';
import { BroadCastApiModelInterface } from '../../Model/Api/BroadCastApiModel';
import { LiveOtherStreamInfoApiModelInterface } from '../../Model/Api/Live/LiveOtherStreamInfoApiModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveHttpConfigApiModelInterface } from '../../Model/Api/Live/LiveHttpConfigApiModel';

/**
* Navigation の ViewModel
*/
class NavigationViewModel extends ViewModel {
    private broadCastApiModel: BroadCastApiModelInterface;
    private liveOtherStreamInfoApiModel: LiveOtherStreamInfoApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    private liveHttpConfigApiModel: LiveHttpConfigApiModelInterface;

    constructor(
        _broadCast: BroadCastApiModelInterface,
        _liveOtherModel: LiveOtherStreamInfoApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface,
        _liveHttpConfigApiModel: LiveHttpConfigApiModelInterface
    ) {
        super();

        this.broadCastApiModel = _broadCast;
        this.liveOtherStreamInfoApiModel = _liveOtherModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
        this.liveHttpConfigApiModel = _liveHttpConfigApiModel;
    }

    public init(): void {
        this.broadCastApiModel.update();
        this.liveOtherStreamInfoApiModel.update();
        this.liveConfigEnableApiModel.update();
        this.liveHttpConfigApiModel.update();
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
        return this.liveConfigEnableApiModel.getHLSLive() || this.liveConfigEnableApiModel.getHttpLive();
    }

    /**
    * 録画配信が有効か返す
    * 有効 true, 無効 false
    */
    public enableRecorded(): boolean {
        return this.liveConfigEnableApiModel.getRecorded();
    }

    /**
    * http View の iOS 用 URL を返す
    */
    public getHttpViewIOSURL(): string | null {
        return this.liveHttpConfigApiModel.getIOS();
    }

    /**
    * http View の android 用 URL を返す
    */
    public getHttpViewAndroidURL(): string | null {
        return this.liveHttpConfigApiModel.getAndroid();
    }
}

export default NavigationViewModel;


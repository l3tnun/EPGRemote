"use strict";

import ViewModel from '../ViewModel';
import { RecordedVideoLinkApiModelInterface } from '../../Model/Api/Recorded/RecordedVideoLinkApiModel';
import { RecordedVideoConfigApiModelInterface} from '../../Model/Api/Recorded/RecordedVideoConfigApiModel';
import { LiveConfigEnableApiModelInterface } from '../../Model/Api/Live/LiveConfigEnableApiModel';
import { LiveRecordedStartWatchApiModelInterface } from '../../Model/Api/Live/Watch/LiveRecordedStartWatchApiModel';

/**
* RecordedVideoLinkDialog の ViewModel
*/
class RecordedVideoLinkDialogViewModel extends ViewModel {
    private recordedVideoLinkApiModel: RecordedVideoLinkApiModelInterface;
    private recordedVideoConfigApiModel: RecordedVideoConfigApiModelInterface;
    private liveConfigEnableApiModel: LiveConfigEnableApiModelInterface;
    private liveRecordedStartWatchApiModel: LiveRecordedStartWatchApiModelInterface;
    private dlStatus: boolean = false; //dl 用 link を生成するか
    public videoSelectorValue: number | null = null; //ビデオプルダウン

    constructor(
        _recordedVideoLinkApiModel: RecordedVideoLinkApiModelInterface,
        _recordedVideoConfigApiModel: RecordedVideoConfigApiModelInterface,
        _liveConfigEnableApiModel: LiveConfigEnableApiModelInterface,
        _liveRecordedStartWatchApiModel: LiveRecordedStartWatchApiModelInterface
    ) {
        super();
        this.recordedVideoLinkApiModel = _recordedVideoLinkApiModel;
        this.recordedVideoConfigApiModel = _recordedVideoConfigApiModel;
        this.liveConfigEnableApiModel = _liveConfigEnableApiModel;
        this.liveRecordedStartWatchApiModel = _liveRecordedStartWatchApiModel;
    }

    //ParentPageController から呼び出される
    public init(): void {
        this.videoSelectorValue = null;
    }

    /*
    * video link の更新
    * @param rec_id 番組の program id
    * @param _dlStauts DL リンクか設定 true: DL リンク, false: 視聴リンク
    */
    public update(rec_id: number, _dlStatus: boolean = false): void {
        this.dlStatus = _dlStatus;
        this.recordedVideoLinkApiModel.update(rec_id);

        //ライブ視聴が有効か
        if(this.dlStatus || !this.liveConfigEnableApiModel.getRecorded()) { return; }
        this.recordedVideoConfigApiModel.update();
    }

    /*
    * 録画配信が有効化返す
    * true: 有効, false: 無効
    */
    public getStreamStatus(): boolean {
        return this.liveConfigEnableApiModel.getRecorded();
    }

    //video link を返す
    public getLink(): { [key: string]: any }[] | null {
        return this.recordedVideoLinkApiModel.getLink();
    }

    //iOS 用の URL テンプレートテキストを返す
    public getiOSURL(): { [key: string]: string } | null {
        return this.recordedVideoLinkApiModel.getiOSURL();
    }

    //Android 用の URL テンプレートテキストを返す
    public getAndroidURL(): { [key: string]: string } | null {
        return this.recordedVideoLinkApiModel.getAndroidURL();
    }

    //DL リンクの状態を返す true: DL リンク, fale 視聴リンク
    public getDlStatus(): boolean {
        return this.dlStatus;
    }

    //配信用の video config を返す
    public getVideoConfig():  { [key: string]: any }[] {
        if(!this.liveConfigEnableApiModel.getRecorded()) { return []; }
        return this.recordedVideoConfigApiModel.getConfig();
    }

    //配信を開始する
    public startStream(id: number, type: number): void {
        if(this.videoSelectorValue == null) {
            console.log('RecordedVideoLinkDialogViewModel video selector is null');
            return;
        }
        this.liveRecordedStartWatchApiModel.update(id, type, this.videoSelectorValue);
    }
}

namespace RecordedVideoLinkDialogViewModel {
    export const dialogId = "recorded_video_link_dialog";
}

export default RecordedVideoLinkDialogViewModel;


"use strict";

import ParentPageController from '../../ParentPageController';
import LiveWatchViewModel from '../../../ViewModel/Live/Watch/LiveWatchViewModel';
import LiveWatchVideoViewModel from '../../../ViewModel/Live/Watch/LiveWatchVideoViewModel';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';

class LiveWatchController extends ParentPageController {
    private liveWatchVideo: LiveWatchVideoViewModel;

    // ViewModel 初期化
    public initModel(): void {
        super.initModel();

        //layout init
        this.liveWatchVideo = <LiveWatchVideoViewModel>this.getModel("LiveWatchVideoViewModel");

        //init
        (<LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel")).init();
        (<LiveWatchViewModel>this.getModel("LiveWatchViewModel")).init();
        this.liveWatchVideo.init();
    }

    protected enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
        this.socketIoManager.enableModule("stopLiveStream");
        this.socketIoManager.enableModule("enableLiveStream");
    }

    protected onRemove(): void {
        super.onRemove();
        this.liveWatchVideo.HlsDestroy();
    }
}

export default LiveWatchController;


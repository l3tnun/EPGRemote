"use strict";

import ParentPageController from '../../ParentPageController';

class LiveWatchController extends ParentPageController {
    // ViewModel 初期化
    public initModel(): void {
        super.initModel();

        //init
        this.getModel("LiveProgramCardViewModel").init();
        this.getModel("LiveWatchViewModel").init();
    }

    protected enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
        this.socketIoManager.enableModule("stopLiveStream");
        this.socketIoManager.enableModule("enableLiveStream");
    }
}

export default LiveWatchController;


"use strict";

import ParentPageController from '../ParentPageController';

class RecordedController extends ParentPageController {
    //ViewModel 初期化
    public initModel(): void {
        super.initModel();

        this.getModel("RecordedViewModel").init();
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("recordedDeleteVideo");
        this.socketIoManager.enableModule("recordedOtherEvent");
    }
}

export default RecordedController;


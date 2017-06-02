"use strict";

import ParentPageController from '../ParentPageController';
import { ControllerStatus } from '../../Enums';

class RecordedController extends ParentPageController {
    //ViewModel 初期化
    public initModel(status: ControllerStatus): void {
        super.initModel(status);

        this.getModel("RecordedViewModel").init(status);
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("recordedDeleteVideo");
        this.socketIoManager.enableModule("recordedOtherEvent");
    }
}

export default RecordedController;


"use strict";

import ParentPageController from '../../ParentPageController';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';

class LiveProgramController extends ParentPageController {
    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
    }

    public initModel(): void {
        super.initModel();

        (<LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel")).init();
    }
}

export default LiveProgramController;


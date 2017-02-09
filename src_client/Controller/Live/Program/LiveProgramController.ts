"use strict";

import Util from '../../../Util/Util';
import ParentPageController from '../../ParentPageController';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';

class LiveProgramController extends ParentPageController {
    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
    }

    public initModel(): void {
        super.initModel();

        let liveProgramCardViewModel = <LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel");
        setTimeout(() => { liveProgramCardViewModel.setup(Util.getCopyQuery()["type"]); }, 100);
    }
}

export default LiveProgramController;


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

        let viewModel = <LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel");
        viewModel.init();
        setTimeout(() => { viewModel.setup(Util.getCopyQuery()["type"]); }, 100);
    }
}

export default LiveProgramController;


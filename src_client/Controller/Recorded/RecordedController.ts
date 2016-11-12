"use strict";

import ParentPageController from '../ParentPageController';
import RecordedViewModel from '../../ViewModel/Recorded/RecordedViewModel';
import Util from '../../Util/Util';

class RecordedController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: RecordedViewModel;

    //ViewModel 初期化
    public initModel(): void {
        this.viewModel = <RecordedViewModel>this.getModel("RecordedViewModel");
        this.viewModel.init();
        this.viewModel.setup(Util.getCopyQuery());
        this.viewModel.update();

        this.getModel("RecordedVideoLinkDialogViewModel").init();
        this.getModel("RecordedSearchMenuViewModel").init();

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("recordedDeleteVideo");
        this.socketIoManager.enableModule("recordedOtherEvent");
    }

    //ページから離れるときに呼び出される
    public onunload(): void {
        super.onunload();
        window.removeEventListener('resize', this.resizeListener, false );
    }

    private resize(): void {
        this.viewModel.resize();
    }
}

export default RecordedController;


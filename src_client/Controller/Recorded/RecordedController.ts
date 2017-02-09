"use strict";

import ParentPageController from '../ParentPageController';
import RecordedViewModel from '../../ViewModel/Recorded/RecordedViewModel';

class RecordedController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: RecordedViewModel;

    //ViewModel 初期化
    public initModel(): void {
        super.initModel();

        this.viewModel = <RecordedViewModel>this.getModel("RecordedViewModel");
        this.viewModel.init();

        this.getModel("RecordedVideoLinkDialogViewModel").init();

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("recordedDeleteVideo");
        this.socketIoManager.enableModule("recordedOtherEvent");
    }

    //ページから離れるときに呼び出される
    public onRemove(): void {
        super.onRemove();
        window.removeEventListener('resize', this.resizeListener, false );
    }

    private resize(): void {
        this.viewModel.resize();
    }
}

export default RecordedController;


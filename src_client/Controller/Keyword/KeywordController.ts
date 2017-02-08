"use strict";

import ParentPageController from '../ParentPageController';
import KeywordViewModel from '../../ViewModel/Keyword/KeywordViewModel';

class KeywordController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: KeywordViewModel;

    //ViewModel 初期化
    public initModel(): void {
        super.initModel();
        this.viewModel = <KeywordViewModel>this.getModel("KeywordViewModel");
        this.viewModel.init();
        setTimeout(() => { this.viewModel.update(); }, 100);

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("keywordEnable");
        this.socketIoManager.enableModule("keywordDelete");
        this.socketIoManager.enableModule("keywordAdd");
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

export default KeywordController;


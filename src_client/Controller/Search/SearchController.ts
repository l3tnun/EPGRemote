"use strict";

import ParentPageController from '../ParentPageController';
import SearchViewModel from '../../ViewModel/Search/SearchViewModel';

class SearchController extends ParentPageController {
    private viewModel: SearchViewModel;

    //ViewModel 初期化
    public initModel(): void {
        super.initModel();
        this.viewModel = <SearchViewModel>this.getModel("SearchViewModel");
        this.viewModel.init();
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
        this.socketIoManager.enableModule("programAutorec");
        this.socketIoManager.enableModule("programSimpleRec");
        this.socketIoManager.enableModule("programCancelaRec");
        this.socketIoManager.enableModule("programCustomRec");
        this.socketIoManager.enableModule("searchOtherEvent");
    }
}

export default SearchController;


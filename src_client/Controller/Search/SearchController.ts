"use strict";

import ParentPageController from '../ParentPageController';

class SearchController extends ParentPageController {
    public initModel(): void {
        super.initModel();
        this.getModel("SearchViewModel").init();
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


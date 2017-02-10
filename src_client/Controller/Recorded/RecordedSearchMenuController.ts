"use strict";

import Controller from '../Controller';

class RecordedSearchMenuController extends Controller {
    public initModel(): void {
        super.initModel();

        this.getModel("RecordedSearchMenuViewModel").init();
    }
}

export default RecordedSearchMenuController;


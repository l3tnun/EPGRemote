"use strict";

import Controller from '../Controller';

/**
* LogPageActionDialog Controller
*/
class LogPageActionDialogController extends Controller {
    public initModel(): void {
        super.initModel();

        this.getModel("LogPageActionDialogViewModel").init();
    }
}

export default LogPageActionDialogController;


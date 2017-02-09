"use strict";

import ParentPageController from '../ParentPageController';

/**
* LogPage Controller
*/
class LogPageController extends ParentPageController {
    public initModel(): void {
        super.initModel();

        this.getModel("LogPageViewModel").init();
    }
}

export default LogPageController;


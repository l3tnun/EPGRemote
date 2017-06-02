"use strict";

import ParentPageController from '../ParentPageController';
import { ControllerStatus } from '../../Enums';

/**
* LogPage Controller
*/
class LogPageController extends ParentPageController {
    public initModel(status: ControllerStatus): void {
        super.initModel(status);

        this.getModel("LogPageViewModel").init(status);
    }
}

export default LogPageController;


"use strict";

import ParentPageController from '../ParentPageController';
import LogPageViewModel from '../../ViewModel/LogPage/LogPageViewModel';

/**
* LogPage Controller
*/
class LogPageController extends ParentPageController {
    public initModel(): void {
        (<LogPageViewModel>this.getModel("LogPageViewModel")).init();
    }
}

export default LogPageController;

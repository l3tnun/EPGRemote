"use strict";

import Controller from '../../Controller';

class LiveWatchStreamInfoController extends Controller {
    // ViewModel 初期化
    public initModel(): void {
        super.initModel();

        this.getModel("LiveWatchStreamInfoViewModel").init();
    }
}

export default LiveWatchStreamInfoController;


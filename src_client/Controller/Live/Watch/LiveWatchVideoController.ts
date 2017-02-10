"use strict";

import Controller from '../../Controller';

class LiveWatchVideoController extends Controller {
    // ViewModel 初期化
    public initModel(): void {
        super.initModel();

        this.getModel("LiveWatchVideoViewModel").init();
    }
}

export default LiveWatchVideoController;


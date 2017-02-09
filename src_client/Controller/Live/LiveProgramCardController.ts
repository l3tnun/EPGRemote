"use strict";

import Controller from '../Controller';

class LiveProgramCardController extends Controller {
    protected initModel(): void {
        super.initModel();

        this.getModel("LiveProgramCardViewModel").init();
    }
}

export default LiveProgramCardController;


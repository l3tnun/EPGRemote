"use strict";

import Controller from '../Controller';

class RecordedVideoLinkDialogController extends Controller {
    public initModel(): void {
        super.initModel();

        this.getModel("RecordedVideoLinkDialogViewModel").init();
    }
}

export default RecordedVideoLinkDialogController;


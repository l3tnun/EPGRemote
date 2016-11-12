"use strict";

import Component from '../Component';
import LiveProgramDialogContentView from '../../View/Live/LiveProgramDialogContentView';

class LiveProgramDialogContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new LiveProgramDialogContentView();
    }

    protected getModels() {
        return {
            LiveProgramDialogContentViewModel: this.container.get("LiveProgramDialogContentViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            SnackbarViewModel: this.container.get("SnackbarViewModel")
        };
    }
}

export default LiveProgramDialogContentComponent;


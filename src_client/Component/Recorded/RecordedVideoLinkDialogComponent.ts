"use strict";

import Component from '../Component';
import RecordedVideoLinkDialogView from '../../View/Recorded/RecordedVideoLinkDialogView';

class RecordedVideoLinkDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new RecordedVideoLinkDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            RecordedVideoLinkDialogViewModel: this.container.get("RecordedVideoLinkDialogViewModel")
        };
    }
}

export default RecordedVideoLinkDialogComponent;


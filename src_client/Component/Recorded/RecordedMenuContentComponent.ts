"use strict";

import Component from '../Component';
import RecordedMenuContentView from '../../View/Recorded/RecordedMenuContentView';

class RecordedMenuContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new RecordedMenuContentView();
    }

    protected getModels() {
        return {
            RecordedMenuViewModel: this.container.get("RecordedMenuViewModel"),
            MenuViewModel: this.container.get("MenuViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            RecordedVideoLinkDialogViewModel: this.container.get("RecordedVideoLinkDialogViewModel")
        };
    }
}

export default RecordedMenuContentComponent;


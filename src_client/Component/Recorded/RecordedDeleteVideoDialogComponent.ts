"use strict";

import Component from '../Component';
import RecordedDeleteVideoDialogView from '../../View/Recorded/RecordedDeleteVideoDialogView';

class RecordedDeleteVideoDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new RecordedDeleteVideoDialogView();
    }

    protected getModels() {
        return {
            RecordedMenuViewModel: this.container.get("RecordedMenuViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            RecordedDeleteVideoViewModel: this.container.get("RecordedDeleteVideoViewModel")
        };
    }
}

export default RecordedDeleteVideoDialogComponent;


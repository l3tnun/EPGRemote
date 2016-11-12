"use strict";

import Component from '../Component';
import RecordedProgramInfoDialogView from '../../View/Recorded/RecordedProgramInfoDialogView';

class RecordedProgramInfoDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new RecordedProgramInfoDialogView();
    }

    protected getModels() {
        return {
            RecordedMenuViewModel: this.container.get("RecordedMenuViewModel")
        };
    }
}

export default RecordedProgramInfoDialogComponent;


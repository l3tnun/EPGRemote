"use strict";

import Component from '../Component';
import ProgramInfoDialogView from '../../View/Program/ProgramInfoDialogView';

class ProgramInfoDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramInfoDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramInfoDialogViewModel: this.container.get("ProgramInfoDialogViewModel")
        };
    }
}

export default ProgramInfoDialogComponent;


"use strict";

import Component from '../Component';
import ProgramTimeDialogView from '../../View/Program/ProgramTimeDialogView';

class ProgramTimeDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramTimeDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramViewModel: this.container.get("ProgramViewModel")
        };
    }
}

export default ProgramTimeDialogComponent;


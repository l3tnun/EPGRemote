"use strict";

import Component from '../Component';
import ProgramController from '../../Controller/Program/ProgramController';
import ProgramView from '../../View/Program/ProgramView';

class ProgramComponent extends Component {
    protected getController() {
        return new ProgramController();
    }

    protected getView() {
        return new ProgramView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramViewModel: this.container.get("ProgramViewModel"),
            ProgramInfoDialogViewModel: this.container.get("ProgramInfoDialogViewModel"),
            ProgramStorageViewModel: this.container.get("ProgramStorageViewModel")
        };
    }
}

export default ProgramComponent;


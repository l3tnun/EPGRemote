"use strict";

import Component from '../Component';
import ProgramContentView from '../../View/Program/ProgramContentView';

class ProgramContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramContentView();
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

export default ProgramContentComponent;


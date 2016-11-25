"use strict";

import Component from '../Component';
import ProgramGenreDialogActionView from '../../View/Program/ProgramGenreDialogActionView';

class ProgramGenreDialogActionComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramGenreDialogActionView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramViewModel: this.container.get("ProgramViewModel"),
            ProgramStorageViewModel: this.container.get("ProgramStorageViewModel")
        };
    }
}

export default ProgramGenreDialogActionComponent;


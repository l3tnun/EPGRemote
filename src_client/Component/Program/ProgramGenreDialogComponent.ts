"use strict";

import Component from '../Component';
import ProgramGenreDialogView from '../../View/Program/ProgramGenreDialogView';

class ProgramGenreDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramGenreDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramViewModel: this.container.get("ProgramViewModel"),
            ProgramStorageViewModel: this.container.get("ProgramStorageViewModel")
        };
    }
}

export default ProgramGenreDialogComponent;


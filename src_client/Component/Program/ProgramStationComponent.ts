"use strict";

import Component from '../Component';
import ProgramStationView from '../../View/Program/ProgramStationView';

class ProgramStationComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramStationView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramViewModel: this.container.get("ProgramViewModel"),
            LiveProgramDialogContentViewModel: this.container.get("LiveProgramDialogContentViewModel")
        };
    }
}

export default ProgramStationComponent;


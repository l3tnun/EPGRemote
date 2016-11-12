"use strict";

import Component from '../Component';
import ProgramTimeView from '../../View/Program/ProgramTimeView';

class ProgramTimeComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new ProgramTimeView();
    }

    protected getModels() {
        return {
            ProgramViewModel: this.container.get("ProgramViewModel")
        };
    }
}

export default ProgramTimeComponent;


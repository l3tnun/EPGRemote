"use strict";

import Component from '../Component';
import LogPageActionDialogController from '../../Controller/LogPage/LogPageActionDialogController';
import LogPageActionDialogContentView from '../../View/LogPage/LogPageActionDialogContentView';

class LogPageActionDialogContentComponent extends Component {
    protected getController() {
        return new LogPageActionDialogController();
    }

    protected getView() {
        return new LogPageActionDialogContentView();
    }

    protected getModels() {
        return  {
            DialogViewModel: this.container.get("DialogViewModel"),
            LogPageActionDialogViewModel: this.container.get("LogPageActionDialogViewModel")
        };
    }
}

export default LogPageActionDialogContentComponent;


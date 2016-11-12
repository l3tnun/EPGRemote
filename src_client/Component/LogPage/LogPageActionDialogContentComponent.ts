"use strict";

import Component from '../Component';
import LogPageActionDialogContentView from '../../View/LogPage/LogPageActionDialogContentView';

class LogPageActionDialogContentComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new LogPageActionDialogContentView();
    }

    protected getModels() {
        return  {
            LogPageActionDialogViewModel: this.container.get("LogPageActionDialogViewModel")
        };
    }
}

export default LogPageActionDialogContentComponent;


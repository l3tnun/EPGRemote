"use strict";

import Component from '../Component';
import LogPageController from '../../Controller/LogPage/LogPageController';
import LogPageView from '../../View/LogPage/LogPageView';

class LogPageComponent extends Component {
    protected getController() {
        return new LogPageController();
    }

    protected getView() {
        return new LogPageView();
    }

    protected getModels() {
        return {
            LogPageViewModel: this.container.get("LogPageViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            LogPageActionDialogViewModel: this.container.get("LogPageActionDialogViewModel")
        };
    }
}

export default LogPageComponent;


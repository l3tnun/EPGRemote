"use strict";

import Component from '../Component';
import RecordedController from '../../Controller/Recorded/RecordedController';
import RecordedView from '../../View/Recorded/RecordedView';

class RecordedComponent extends Component {
    protected getController() {
        return new RecordedController();
    }

    protected getView() {
        return new RecordedView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            RecordedViewModel: this.container.get("RecordedViewModel"),
            PaginationViewModel: this.container.get("PaginationViewModel"),
            MenuViewModel: this.container.get("MenuViewModel"),
            RecordedMenuViewModel: this.container.get("RecordedMenuViewModel"),
            RecordedVideoLinkDialogViewModel: this.container.get("RecordedVideoLinkDialogViewModel"),
            RecordedSearchMenuViewModel: this.container.get("RecordedSearchMenuViewModel")
        };
    }
}

export default RecordedComponent;


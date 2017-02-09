"use strict";

import Component from '../Component';
import RecordedSearchMenuController from '../../Controller/Recorded/RecordedSearchMenuController';
import RecordedSearchMenuView from '../../View/Recorded/RecordedSearchMenuView';

class RecordedSearchMenuComponent extends Component {
    protected getController() {
        return new RecordedSearchMenuController();
    }

    protected getView() {
        return new RecordedSearchMenuView();
    }

    protected getModels() {
        return {
            RecordedSearchMenuViewModel: this.container.get("RecordedSearchMenuViewModel")
        };
    }
}

export default RecordedSearchMenuComponent;


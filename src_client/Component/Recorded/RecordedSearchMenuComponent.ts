"use strict";

import Component from '../Component';
import RecordedSearchMenuView from '../../View/Recorded/RecordedSearchMenuView';

class RecordedSearchMenuComponent extends Component {
    protected getController() {
        return null;
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


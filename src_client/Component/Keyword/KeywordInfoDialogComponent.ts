"use strict";

import Component from '../Component';
import KeywordInfoDialogView from '../../View/Keyword/KeywordInfoDialogView';

/**
* KeywordInfoDialog Component
*/
class KeywordInfoDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new KeywordInfoDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            KeywordViewModel: this.container.get("KeywordViewModel"),
            KeywordInfoDialogViewModel: this.container.get("KeywordInfoDialogViewModel"),
            KeywordDeleteDialogViewModel: this.container.get("KeywordDeleteDialogViewModel")
        };
    }
}

export default KeywordInfoDialogComponent;


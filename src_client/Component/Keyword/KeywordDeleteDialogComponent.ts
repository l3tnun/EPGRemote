"use strict";

import Component from '../Component';
import KeywordDeleteDialogView from '../../View/Keyword/KeywordDeleteDialogView';

class KeywordDeleteDialogComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new KeywordDeleteDialogView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            KeywordDeleteDialogViewModel: this.container.get("KeywordDeleteDialogViewModel")
        };
    }
}

export default KeywordDeleteDialogComponent;


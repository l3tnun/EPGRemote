"use strict";

import Component from '../Component';
import KeywordController from '../../Controller/Keyword/KeywordController';
import KeywordView from '../../View/Keyword/KeywordView';

class KeywordComponent extends Component {
    protected getController() {
        return new KeywordController();
    }

    protected getView() {
        return new KeywordView();
    }

    protected getModels() {
        return {
            DialogViewModel: this.container.get("DialogViewModel"),
            PaginationViewModel: this.container.get("PaginationViewModel"),
            MenuViewModel: this.container.get("MenuViewModel"),
            KeywordViewModel: this.container.get("KeywordViewModel"),
            KeywordInfoDialogViewModel: this.container.get("KeywordInfoDialogViewModel")
        };
    }
}

export default KeywordComponent;


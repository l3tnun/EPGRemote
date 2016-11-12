"use strict";

import Component from '../Component';
import SearchOptionView from '../../View/Search/SearchOptionView';

class SearchOptionComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new SearchOptionView();
    }

    protected getModels() {
        return {
            SearchViewModel: this.container.get("SearchViewModel")
        };
    }
}

export default SearchOptionComponent;


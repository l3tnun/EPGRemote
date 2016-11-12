"use strict";

import Component from '../Component';
import SearchResultView from '../../View/Search/SearchResultView';

class SearchResultComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new SearchResultView();
    }

    protected getModels() {
        return {
            SearchViewModel: this.container.get("SearchViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            ProgramInfoDialogViewModel: this.container.get("ProgramInfoDialogViewModel"),
        };
    }
}

export default SearchResultComponent;


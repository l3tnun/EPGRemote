"use strict";

import Component from '../Component';
import SearchAddKeywordView from '../../View/Search/SearchAddKeywordView';

class SearchAddKeywordComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new SearchAddKeywordView();
    }

    protected getModels() {
        return {
            SearchViewModel: this.container.get("SearchViewModel")
        };
    }
}

export default SearchAddKeywordComponent;


"use strict";

import Component from '../Component';
import SearchController from '../../Controller/Search/SearchController';
import SearchView from '../../View/Search/SearchView';

class SearchComponent extends Component {
    protected getController() {
        return new SearchController();
    }

    protected getView() {
        return new SearchView();
    }

    protected getModels() {
        return {
            SearchViewModel: this.container.get("SearchViewModel")
        };
    }
}

export default SearchComponent;


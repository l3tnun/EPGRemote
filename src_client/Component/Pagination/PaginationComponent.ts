"use strict";

import Component from '../Component';
import PaginationView from '../../View/Pagination/PaginationView';

/**
* Pagination Component
* @param { maxWidth: 400 } の形式で Pagination の max-width を指定できる
*/
class PaginationComponent extends Component {
    protected getController() {
        return null;
    }

    protected getView() {
        return new PaginationView();
    }

    protected getModels() {
        return  {
            PaginationViewModel: this.container.get("PaginationViewModel")
        };
    }
}

export default PaginationComponent;


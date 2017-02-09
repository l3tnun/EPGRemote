"use strict";

import Component from '../Component';
import PaginationController from '../../Controller/Pagination/PaginationController';
import PaginationView from '../../View/Pagination/PaginationView';

/**
* Pagination Component
* @param { maxWidth: 400 } の形式で Pagination の max-width を指定できる
*/
class PaginationComponent extends Component {
    protected getController() {
        return new PaginationController();
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


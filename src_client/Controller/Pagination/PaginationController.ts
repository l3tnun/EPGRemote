"use strict";

import Controller from '../Controller';

class PaginationController extends Controller {
    protected initModel(): void {
        super.initModel();

        this.getModel("PaginationViewModel").init();
    }
}

export default PaginationController;


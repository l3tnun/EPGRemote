"use strict";

import * as http from 'http';
import * as url from 'url';
import Controller from '../../Controller/Controller';
import dummyView from './dummyView'

class dummyController extends Controller {
    private code: number;

    constructor(_code: number) {
        super();
        this.code = _code;
    }

    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, _response: http.ServerResponse, _postData: string): void {
        let view = new dummyView(_response, this.code);
        view.execute();
    }
}

export default dummyController;


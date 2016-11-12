"use strict";

import * as http from 'http';
import View from '../../View/View';

class dummyView extends View {
    private response: http.ServerResponse;
    private code: number;

    constructor (_response: http.ServerResponse, _code: number) {
        super();
        this.response = _response;
        this.code = _code;
    }

    public execute(): void {
        this.response.writeHead(this.code, {"Content-Type": "text/plain"});
        this.response.write("dummy view.");
        this.response.end();
    }
}

export default dummyView;


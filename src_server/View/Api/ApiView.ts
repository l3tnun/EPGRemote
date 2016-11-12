"use strict";

import * as http from 'http';
import View from '../View';
import ApiModel from '../../Model/Api/ApiModel';

abstract class ApiView extends View {
    protected response: http.ServerResponse;

    constructor (_response: http.ServerResponse) {
        super();
        this.response = _response;
    }

    protected responseJson(json: JSON) {
        let result = "";

        try {
            result = JSON.stringify(json)
            this.response.writeHead(200, {
                'content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            });
            this.response.write(result);
        } catch(e) {
            this.response.writeHead(400, {
                'Content-Type': 'text/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            });
            this.response.write("Json stringify error.");
        }
        this.response.end();
   }

    protected resposeFormatError() {
        this.response.writeHead(415, {
            'Content-Type': 'text/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        });
        this.response.write(JSON.stringify( { error: "response format error." } ));
        this.response.end();
    }

    protected responseServerError() {
        this.response.writeHead(500, {
            'Content-Type': 'text/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        });
        this.response.write(JSON.stringify( { error: "server error." } ));
        this.response.end();
    }

    public getModel(name: string): ApiModel {
        return <ApiModel>super.getModel(name);
    }

    public abstract execute(): void;
}

export default ApiView;


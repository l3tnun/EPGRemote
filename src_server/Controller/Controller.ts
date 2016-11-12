"use strict";

import * as http from 'http';
import * as url from 'url';
import Base from '../Base';
import ModelFactory from '../Model/ModelFactory';

abstract class Controller extends Base {
    protected modelFactory: ModelFactory = ModelFactory.getInstance();

    public abstract execute(_parsedUrl: url.Url, _request: http.ServerRequest, _response: http.ServerResponse, _postData: string): void;
}

export default Controller;


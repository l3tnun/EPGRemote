"use strict";

import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import Controller from '../../Controller';
import NormalApiView from '../../../View/Api/NormalApiView';

class SearchController extends Controller {
    public execute(_parsedUrl: url.Url, _request: http.ServerRequest, response: http.ServerResponse, postData: string): void {
        this.log.access.info("controller 'SearchController' was called.");

        let query = querystring.parse(postData);
        let option = {
            search:         query["search"],
            use_regexp:     Number(query["use_regexp"]),
            collate_ci:     Number(query["collate_ci"]),
            ena_title:      Number(query["ena_title"]),
            ena_desc:       Number(query["ena_desc"]),
            channel_id:     Number(query["channel_id"]),
            typeGR:         Number(query["typeGR"]),
            typeBS:         Number(query["typeBS"]),
            typeCS:         Number(query["typeCS"]),
            typeEX:         Number(query["typeEX"]),
            category_id:    Number(query["category_id"]),
            first_genre:    Number(query["first_genre"]),
            sub_genre:      Number(query["sub_genre"]),
            prgtime:        Number(query["prgtime"]),
            period:         Number(query["period"]),
            week0:          Number(query["week0"]),
            week1:          Number(query["week1"]),
            week2:          Number(query["week2"]),
            week3:          Number(query["week3"]),
            week4:          Number(query["week4"]),
            week5:          Number(query["week5"]),
            week6:          Number(query["week6"])
        }

        let model = this.modelFactory.get("SearchModel");
        model.setOption(option);

        let view  = new NormalApiView(response, "SearchModel");
        view.setModels({ SearchModel: model });

        model.addViewEvent(view);
        model.execute();
    }
}

export default SearchController;


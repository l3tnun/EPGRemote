"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class RecordedKeywordListModel extends ApiModel {
    private getRecordedKeywordListSql: Sql;

    constructor(_getRecordedKeywordListSql: Sql) {
        super();
        this.getRecordedKeywordListSql = _getRecordedKeywordListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["search"])) { this.option["search"] = null; }
        if(this.checkNull(this.option["autorec"])) { this.option["autorec"] = null; }
        if(this.checkNull(this.option["category_id"])) { this.option["category_id"] = null; }
        if(this.checkNull(this.option["channel_id"])) { this.option["channel_id"] = null; }

        this.getRecordedKeywordListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let keywordName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                keywordName[result["id"]] = result["keyword"];
            });

            //録画一覧
            let keywords: { [key: string]: any }[] = []
            rows[1].forEach((result: { [key: string]: any }) => {
                let keyword: { [key: string]: any } = {}
                keyword["id"] = result["autorec"];
                keyword["name"] = keywordName[result["autorec"]]
                if(typeof keyword["name"] == "undefined") { keyword["name"] = "キーワードなし"; }
                keyword["count"] = result["count(autorec)"];
                keywords.push(keyword);
            });

            this.results = keywords;

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default RecordedKeywordListModel;


"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class RecordedCategoryListModel extends ApiModel {
    private getRecordedCategoryListSql: Sql;

    constructor(_getRecordedCategoryListSql: Sql) {
        super();
        this.getRecordedCategoryListSql = _getRecordedCategoryListSql
    }

    public execute(): void {
        if(this.checkNull(this.option["search"])) { this.option["search"] = null; }
        if(this.checkNull(this.option["autorec"])) { this.option["autorec"] = null; }
        if(this.checkNull(this.option["category_id"])) { this.option["category_id"] = null; }
        if(this.checkNull(this.option["channel_id"])) { this.option["channel_id"] = null; }

        this.getRecordedCategoryListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let categoryName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                categoryName[result["id"]] = result["name_jp"];
            });

            //録画一覧
            let categorys: { [key: string]: any }[] = []
            rows[1].forEach((result: { [key: string]: any }) => {
                let category: { [key: string]: any } = {}
                category["id"] = result["category_id"];
                category["name"] = categoryName[result["category_id"]]
                if(typeof category["name"] == "undefined") { category["name"] = "ジャンルなし"; }
                category["count"] = result["count(category_id)"];
                categorys.push(category);
            });

            this.results = categorys;

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default RecordedCategoryListModel;


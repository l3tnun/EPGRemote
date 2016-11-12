"use strict";

import * as path from 'path';
import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class RecordedListModel extends ApiModel {
    private getRecordedListSql: Sql;

    constructor(_getRecordedListSql: Sql) {
        super();
        this.getRecordedListSql = _getRecordedListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["search"])) { this.option["search"] = null; }
        if(this.checkNull(this.option["autorec"])) { this.option["autorec"] = null; }
        if(this.checkNull(this.option["category_id"])) { this.option["category_id"] = null; }
        if(this.checkNull(this.option["channel_id"])) { this.option["channel_id"] = null; }
        if(this.checkNull(this.option["limit"])) { this.option["limit"] = 24; }
        if(this.checkNull(this.option["page"])) { this.option["page"] = 1; }

        this.getRecordedListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let channelName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                channelName[result["id"]] = result["name"]
            });

            //録画一覧
            let programs: { [key: string]: any }[] = []
            rows[1].forEach((result: { [key: string]: any }) => {
                let program: { [key: string]: any } = {}
                program["id"] = result["id"]
                program["thumbs"] = `/thumbs/${ path.basename(result["path"].toString('UTF-8')) }.jpg`;
                program["title"] = result["title"];
                program["starttime"] = result["starttime"];
                program["endtime"] = result["endtime"];
                program["channel_name"] = channelName[result["channel_id"]];
                program["description"] = result["description"];
                program["keyword_id"] = result["autorec"];
                programs.push(program);
            });

            this.results = {
                programs: programs,
                totalNum: rows[2][0]["count(*)"],
                limit: Number(this.option["limit"])
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default RecordedListModel;


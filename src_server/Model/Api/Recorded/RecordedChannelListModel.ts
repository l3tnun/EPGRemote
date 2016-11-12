"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class RecordedChannelListModel extends ApiModel {
    private getRecordedChannelListSql: Sql;

    constructor(_getRecordedChannelListSql: Sql) {
        super();
        this.getRecordedChannelListSql = _getRecordedChannelListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["search"])) { this.option["search"] = null; }
        if(this.checkNull(this.option["autorec"])) { this.option["autorec"] = null; }
        if(this.checkNull(this.option["channel_id"])) { this.option["channel_id"] = null; }
        if(this.checkNull(this.option["channel_id"])) { this.option["channel_id"] = null; }

        this.getRecordedChannelListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let channelName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                channelName[result["id"]] = result["name"];
            });

            //録画一覧
            let channels: { [key: string]: any }[] = []
            rows[1].forEach((result: { [key: string]: any }) => {
                let channel: { [key: string]: any } = {}
                channel["id"] = result["channel_id"];
                channel["name"] = channelName[result["channel_id"]]
                if(typeof channel["name"] == "undefined") { channel["name"] = "放送局なし"; }
                channel["count"] = result["count(channel_id)"];
                channels.push(channel);
            });

            this.results = channels;

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default RecordedChannelListModel;


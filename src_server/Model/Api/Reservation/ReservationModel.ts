"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class ReservationModel extends ApiModel {
    private getReservationListSql: Sql;

    constructor(_getReservationListSql: Sql) {
        super();
        this.getReservationListSql = _getReservationListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["limit"])) { this.option["limit"] = 24; }
        if(this.checkNull(this.option["page"])) { this.option["page"] = 1; }

        this.getReservationListSql.execute(this.option, (rows) => {
            this.results = {}

            //channel name
            let channelName = {}
            rows[0].forEach((result: { [key: string]: any }) => {
                channelName[result["id"]] = result["name"]
            });

            let recMode = this.config.getConfig().epgrecConfig.recMode;

            //予約一覧
            let programs: { [key: string]: any }[] = []
            rows[1].forEach((result: { [key: string]: any }) => {
                let program = {}
                program["id"] = result["id"]
                program["program_id"] = result["program_id"]
                program["title"] = result["title"];
                program["starttime"] = result["starttime"];
                program["endtime"] = result["endtime"];
                program["channel_name"] = channelName[result["channel_id"]];
                program["description"] = result["description"];
                program["type"] = result["type"];
                program["autorec"] = result["autorec"];
                program["mode"] = recMode[result["mode"]].name;
                programs.push(program);
            });

            this.results = {
                programs: programs,
                limit: Number(this.option["limit"]),
                totalNum: rows[2][0]["count(*)"]
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default ReservationModel;


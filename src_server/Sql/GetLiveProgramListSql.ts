"use strict";

import Sql from './Sql';

class GetLiveProgramListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetLiveProgramList');

        let time = "";
        let otherCondition = "";

        //放送波
        if(typeof option["type"] != "undefined") {
            otherCondition += ` and type = '${ option["type"] }'`;
        }

        //時間(分)
        if(typeof option["time"] != "undefined" && option["time"] > 0) {
            time = " + INTERVAL " + (option["time"] * 60) + " SECOND";
        }

        //放送局指定
        if(typeof option["channel"] != "undefined") {
            otherCondition += ` and channel = '${ option["channel"] }'`;
        }

        let sql = `select name, ${this.recordName}channelTbl.type, sid, ${this.recordName}channelTbl.channel, ${this.recordName}channelTbl.channel_disc, title, starttime, endtime, description from ${this.recordName}channelTbl inner join (select * from ${this.recordName}programTbl where starttime <= (${ this.getNow() } ${time}) and endtime >= (${ this.getNow() } ${time}) ${otherCondition}) as programTbl on ${this.recordName}channelTbl.channel_disc = programTbl.channel_disc order by sid;`;

        this.runQuery(sql, (rows) => {
            if(typeof option["sid"] != "undefined") {
                for(let i = 0; i < rows.length; i++) {
                    if(option["sid"] == rows[i]["sid"]) {
                        callback(rows[i]);
                        return;
                    }
                }
                callback({});
            } else if(typeof option["type"] == "undefined") {
                callback({});
                return;
            } else {
                callback(rows);
            }
        }, (code) => { errCallback(code); });
    }
}

export default GetLiveProgramListSql;


"use strict";

import Sql from './Sql';

class GetProgramListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetProgramList');

        let channelOption = "";
        let typeOption = "";
        let dayMax = 1;

        //単局表示
        if(option["ch"] != null) {
            option["length"] = 24;
            dayMax = 7;
            channelOption = `channel_disc="${ option["ch"] }" `;
        } else {
            typeOption = `type="${ option["type"] }"`;
            if( option["length"] == null) { option["length"] = this.config.getConfig().programLength; }
        }

        let topTime = new Date(`${ option["time"].substr(0,4) }-${ option["time"].substr(4,2) }-${ option["time"].substr(6,2) } ${ option["time"].substr(8,2) }:00:00`);
        let startTime = topTime;
        let endTime = new Date(topTime.getTime() + (option["length"] * 1000 * 60 * 60));

        //カテゴリ
        let sql =  `select id, name_jp from ${ this.recordName }categoryTbl order by id;`;

        //チャンネルリスト
        sql += `select * from ${ this.recordName }channelTbl where ${typeOption} ${channelOption} order by sid;`;

        //録画済み
        sql += `select program_id from ${ this.recordName }reserveTbl where complete=0`;
        if(option["ch"] != null) { sql += ` and ${ channelOption };`; } else { sql +=';'; }

        for(let i = 1; i <= dayMax; i++) {
            sql += `select * from ${ this.recordName }programTbl where ${ typeOption } ${ channelOption } and endtime > '${ this.getSqlTimeStr(topTime) }' and '${ this.getSqlTimeStr(endTime) }' > starttime order by starttime;`;
            topTime = new Date(topTime.getTime() + (1000 * 60 * 60 * 24));
            endTime = new Date(endTime.getTime() + (1000 * 60 * 60 * 24));
        }

        if(option["ch"] == null) { endTime = new Date(startTime.getTime() + (option["length"] * 1000 * 60 * 60)); }

        this.runQuery(sql, (rows) => { rows.push( {startTime: startTime, endTime: endTime }); callback(rows); },
        (code) => { errCallback(code); });
    }

    private getSqlTimeStr(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00:00`;
    }
}

export default GetProgramListSql;


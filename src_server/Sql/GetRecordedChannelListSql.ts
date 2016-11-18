"use strict";

import RecordedBaseSql from './RecordedBaseSql'

class GetRecordedChannelListSql extends RecordedBaseSql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedChannelListSql');
        let sqlOption = this.buildRecordedOptionQuery(option);

        let sql = `select id, name from ${ this.recordName }channelTbl;`
        sql +=    `select channel_id, count(channel_id) from ${ this.recordName }reserveTbl where starttime <= ${ this.getNow() } ${ sqlOption } group by channel_id;`

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedChannelListSql;


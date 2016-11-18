"use strict";

import RecordedBaseSql from './RecordedBaseSql'
import SqlUtil from './SqlUtil'

class GetRecordedListSql extends RecordedBaseSql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedListSql');

        let page: number = option["page"];
        let limit: number = option["limit"];

        let sqlOption = this.buildRecordedOptionQuery(option);

        let sql = `select * from ${ this.recordName }channelTbl;`
        sql +=    `select * from ${ this.recordName }reserveTbl where starttime <= ${ this.getNow() } ${ sqlOption } order by starttime desc limit ${ limit } offset ${ SqlUtil.getOffset(page, limit) };`
        sql +=    `select count(*) from ${ this.recordName }reserveTbl where starttime <= ${ this.getNow() } ${ sqlOption } order by starttime desc`;

        console.log(sql);

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedListSql;


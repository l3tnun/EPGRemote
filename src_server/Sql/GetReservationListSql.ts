"use strict";

import Sql from './Sql'
import SqlUtil from './SqlUtil'

class GetReservationListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetReservationListSql');

        let page: number = option["page"];
        let limit: number = option["limit"];

        let sql = `select * from ${ this.recordName }channelTbl;`
        sql += `select * from ${ this.recordName }reserveTbl where endtime >= ${ this.getNow() } and autorec>=0 order by starttime limit ${ limit } offset ${ SqlUtil.getOffset(page, limit) };`
        sql += `select count(*) from ${ this.recordName }reserveTbl where endtime >= ${ this.getNow() } order by starttime`;

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetReservationListSql;


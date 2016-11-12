"use strict";

import RecordedBaseSql from './RecordedBaseSql'

class GetRecordedKeywordListSql extends RecordedBaseSql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedKeywordListSql');
        let sqlOption = this.buildRecordedOptionQuery(option);

        let sql = `select id, keyword from ${ this.recordName }keywordTbl;`
        sql +=    `select autorec, count(autorec) from ${ this.recordName }reserveTbl where starttime <= now() ${ sqlOption } group by autorec;`

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedKeywordListSql;


"use strict";

import RecordedBaseSql from './RecordedBaseSql'

class GetKeywordByIdSql extends RecordedBaseSql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sqlGetKeywordByIdSql');

        let id = option["keyword_id"];

        let sql = `select * from ${ this.recordName }keywordTbl where id = ${ id }; `;
        sql += `select * from ${ this.recordName }transexpandTbl where key_id = ${ id } order by id; `

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetKeywordByIdSql;


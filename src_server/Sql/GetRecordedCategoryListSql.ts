"use strict";

import RecordedBaseSql from './RecordedBaseSql'

class GetRecordedCategoryListSql extends RecordedBaseSql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedCategoryListSql');
        let sqlOption = this.buildRecordedOptionQuery(option);

        let sql = `select id, name_jp from ${ this.recordName }categoryTbl;`
        sql +=    `select category_id, count(category_id) from ${ this.recordName }reserveTbl where starttime <= now() ${ sqlOption } group by category_id;`

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedCategoryListSql;


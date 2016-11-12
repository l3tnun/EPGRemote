"use strict";

import Sql from './Sql';

class GetRecordedVideoRealPathSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedVideoPathSql');

        let id = option["id"];
        let type = option["type"];
        let sql = "";

        if(type == 0) {
            sql = `select path from ${ this.recordName }reserveTbl where id = ${ id };`
        } else {
            sql = `select path from ${ this.recordName }transcodeTbl where id = ${ id } order by id;`
        }

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedVideoRealPathSql;


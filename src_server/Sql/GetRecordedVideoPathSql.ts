"use strict";

import Sql from './Sql';

class GetRecordedVideoPathSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedVideoPathSql');

        let rec_id: number = option["rec_id"];

        let sql = `select id, name, status, ts_del, path from ${ this.recordName }transcodeTbl where rec_id = ${rec_id} order by id;`
        sql += `select id, path from ${ this.recordName }reserveTbl where id = ${rec_id} order by id;`;

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedVideoPathSql;


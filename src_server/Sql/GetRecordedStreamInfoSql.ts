"use strict";

import Sql from './Sql';

class GetRecordedStreamInfoSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetRecordedStreamInfoSql');

        let type: number = option["type"];
        let id: number = option["id"];

        let sql = `select title name, title, starttime, endtime, description from ${ this.recordName }reserveTbl where id = `;

        if(type == 0) { sql += String(id); }
        else { sql += `any ( select rec_id from ${ this.recordName }transcodeTbl where id = ${ id } )`; }

        this.runQuery(sql, (rows) => { callback(rows[0]); },
        (code) => { errCallback(code); });
    }
}

export default GetRecordedStreamInfoSql;


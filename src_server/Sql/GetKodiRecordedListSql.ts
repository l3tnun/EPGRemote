"use strict";

import Sql from './Sql'

class GetKodiRecordedListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetKodiRecordedListSql');

        let sort: string = option["asc"] ? "asc" : "desc";

        let sql = `select ${ this.recordName }reserveTbl.id,`;
        sql += `${ this.recordName }transcodeTbl.id as trans_id, `;
        sql += `${ this.recordName }reserveTbl.title, `;
        sql += `${ this.recordName }reserveTbl.description, `;
        sql += `${ this.recordName }reserveTbl.starttime, `;
        sql += `${ this.recordName }reserveTbl.endtime, `;
        sql += `${ this.recordName }reserveTbl.path, `;
        sql += `${ this.recordName }transcodeTbl.status, `;
        sql += `${ this.recordName }transcodeTbl.ts_del, `;
        sql += `${ this.recordName }transcodeTbl.path as enc_path `;
        sql += `from ${ this.recordName }reserveTbl left join ${ this.recordName }transcodeTbl `;
        sql += `on ${ this.recordName }reserveTbl.id = ${ this.recordName }transcodeTbl.rec_id `;
        sql += `where ${ this.recordName }reserveTbl.starttime <= NOW() `;
        sql += `order by ${ this.recordName }reserveTbl.starttime ${ sort } `;

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetKodiRecordedListSql;


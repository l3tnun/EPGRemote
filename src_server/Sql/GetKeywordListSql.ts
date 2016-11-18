"use strict";

import Sql from './Sql'
import SqlUtil from './SqlUtil'

class GetKeywordListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetKeywordListSql');

        let page = option["page"];
        let limit = option["limit"];
        let keyword_id = option["keyword_id"];
        let keywordOption = (typeof keyword_id != "undefined") ? `where id = ${ keyword_id } ` : "";

        let sql = `select * from ${ this.recordName }channelTbl; `;
        sql += `select * from ${ this.recordName }categoryTbl; `;
        sql += `select autorec, count(id) from Recorder_reserveTbl where starttime <= ${ this.getNow() } group by autorec; `
        sql += `select * from ${ this.recordName }keywordTbl ${ keywordOption } order by id limit ${ limit } offset ${ SqlUtil.getOffset(page, limit) }; `;
        sql += `select count(*) from ${ this.recordName }keywordTbl;`;
        if(typeof keyword_id != "undefined") {
            sql += `select * from ${ this.recordName }transexpandTbl where key_id = ${ keyword_id } order by id; `
        }

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetKeywordListSql;


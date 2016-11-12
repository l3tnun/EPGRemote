"use strict";

import Sql from './Sql';

class GetSearchResultConfigSql extends Sql {
    public execute(_option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetProgramList');

        //チャンネルリスト
        let sql = `select * from ${ this.recordName }channelTbl;`;

        //録画済み
        sql += `select program_id from ${ this.recordName }reserveTbl where complete=0;`;

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetSearchResultConfigSql;


"use strict";

import Sql from './Sql';

class GetSearchConfigSql extends Sql {
    public execute(_option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetSearchConfig');

        //カテゴリ
        let sql =  `select id, name_jp from ${ this.recordName }categoryTbl order by id;`;

        //チャンネルリスト
        sql += `select * from ${ this.recordName }channelTbl where type = "GR" and skip=0 order by sid;`;
        sql += `select * from ${ this.recordName }channelTbl where type = "BS" and skip=0 order by sid;`;
        sql += `select * from ${ this.recordName }channelTbl where type = "CS" and skip=0 order by sid;`;
        sql += `select * from ${ this.recordName }channelTbl where type = "EX" and skip=0 order by sid;`;


        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetSearchConfigSql;


"use strict";

import Sql from './Sql'

class GetLogListSql extends Sql {
    public execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void {
        this.log.system.info('call sql GetLogListSql');


        let selectOption = "";
        for(let key in option) {
            if(selectOption != "" && option[key]) { selectOption += " or"; }
            if(option[key]) { selectOption += ` level=${key}`; }
        }

        if(selectOption == "") {
            callback([]);
            return;
        }

        let sql = `select * from ${ this.recordName }logTbl where${selectOption} order by id desc limit 300;`;

        this.runQuery(sql, (rows) => { callback(rows); },
        (code) => { errCallback(code); });
    }
}

export default GetLogListSql;


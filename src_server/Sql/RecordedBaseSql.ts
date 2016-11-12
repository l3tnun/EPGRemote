"use strict";

import Sql from './Sql';

abstract class RecordedBaseSql extends Sql {
    protected buildRecordedOptionQuery(option: { [key: string]: any }): string {
        let search = option["search"];
        let autorec = option["autorec"];
        let category_id = option["category_id"];
        let channel_id = option["channel_id"];

        //検索キーワードの query を組み立てる
        let keywordQuery: string | null = null;
        if(search != null) {
            keywordQuery = search.replace(/　/g, " ").trim().replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');
        }

        //autore, category, channel のクエリ
        let sqlOption = '';
        sqlOption += this.buildQuery("autorec", autorec);
        sqlOption += this.buildQuery("category_id", category_id);
        sqlOption += this.buildQuery("channel_id", channel_id);

        if(keywordQuery != null && keywordQuery.length != 0) {
            sqlOption += ` and (${ this.buildLikeOptionStr("title", keywordQuery) } or `;
            sqlOption += `${ this.buildLikeOptionStr("description", keywordQuery) }) `;
        }

        return sqlOption;
    }

    protected buildLikeOptionStr(field: string, searchSQLQuery: string): string {
        return `(${field} collate utf8_unicode_ci like "%`
        + searchSQLQuery.replace(/\s+/g, `%") and (${field} collate utf8_unicode_ci like "%`)
        + `%")`;
    }

    protected buildQuery(name: string, query: number): string {
        if(query != null) { return ` and ${ name } = ${ query } `; }
        return '';
    }

    public abstract execute(option: { [key: string]: any }, callback: (row: any) => void, errCallback: (error: number) => void): void;
}

export default RecordedBaseSql;


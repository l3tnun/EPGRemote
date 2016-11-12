"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';

class LogModel extends ApiModel {
    private getLogListSql: Sql;

    constructor(_getLogListSql: Sql) {
        super();
        this.getLogListSql = _getLogListSql;
    }

    public execute(): void {
        let sqlOption = { 0: false, 1: false, 2: false, 3: false}
        if(this.checkLevel(this.option["info"]))    { sqlOption[0] = true; }
        if(this.checkLevel(this.option["warning"])) { sqlOption[1] = true; }
        if(this.checkLevel(this.option["error"]))   { sqlOption[2] = true; }
        if(this.checkLevel(this.option["debug"]))   { sqlOption[3] = true; }

        this.getLogListSql.execute(sqlOption, (rows) => {
            this.results = rows;

            rows.map((log: { [key: string]: any }) => {
                let addMessage = "";
                log["link"] = {};
                let match = log["message"].match(/<("[^"]*"|'[^']*'|[^'">])*>/g);
                if(match != null) {
                    let replaceData: string[] = [];
                    match.map((data: string) => {
                        replaceData.push(data);
                        if(data.indexOf('input type="button" value=') != -1) {
                            addMessage = "[" + data.substring(data.indexOf("value=\"") + 7, data.indexOf("\" onClick")) + "]";
                        }
                    });

                    //log.link
                    replaceData.map((data: string) => {
                        data.split(' ').map((str: string) => {
                            if(str.indexOf("href=") == -1) { return; }
                            if(str.indexOf("index.php") != -1) {
                                str = str.match(/\".+?\"/g)![0].replace(/"/g, "");
                                log["link"]["program"] = str.split("?")[1];
                            } else if(str.indexOf("recordedTable.php") != -1) {
                                str = str.match(/\'.+?\'/g)![0].replace(/'/g, "");
                                log["link"]["recorded"] = str.replace("key", "keyword_id").split("?")[1];
                            } else if(str.indexOf("programTable.php") != -1) {
                                str = str.match(/\'.+?\'/g)![0].replace(/'/g, "");
                                log["link"]["search"] = str.split("?")[1];
                            }
                        });
                    });

                    log["message"] = addMessage + log["message"].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
                }
            });

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private checkLevel(value: string): boolean {
        return (typeof value != "undefined" && Number(value) == 1)
    }
}

export default LogModel;


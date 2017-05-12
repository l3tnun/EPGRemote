"use strict";

import SortCheannelMapApiModel from '../SortCheannelMapApiModel';
import Sql from '../../../Sql/Sql';

class LiveProgramModel extends SortCheannelMapApiModel {
    private getLiveProgramListSql: Sql;

    constructor(_getLiveProgramListSql: Sql) {
        super();
        this.getLiveProgramListSql = _getLiveProgramListSql;
    }

    public execute(): void {
        this.getLiveProgramListSql.execute(this.option, (rows) => {
            this.results = rows;
            let nowDate = new Date().getTime();

            if(typeof rows.length == "undefined" || rows.length == 0) { //空
                this.eventsNotify();
                return;
            }

            let minEndtime = 6048000000;
            rows.map((data: { [key: string]: any }) => {
                let endtime = new Date(data["endtime"]).getTime() - nowDate;
                if(minEndtime > endtime) { minEndtime = endtime; }
            });

            //sort
            if(!this.checkNull(this.option["type"])) {
                this.results = this.sortChannel(this.option["type"], this.results);
            }

            this.results.push({ updateTime: minEndtime + this.getRandtime() });

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default LiveProgramModel;


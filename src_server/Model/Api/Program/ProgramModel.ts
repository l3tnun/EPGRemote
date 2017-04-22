"use strict";

import ApiModel from '../ApiModel';
import SubGenreModule from '../../SubGenreModule';
import Sql from '../../../Sql/Sql';

class ProgramModel extends ApiModel {
    private getProgramListSql: Sql;

    constructor(_getProgramListSql: Sql) {
        super();
        this.getProgramListSql = _getProgramListSql;
    }

    public execute(): void {
        if(this.checkNull(this.option["type"])) { this.option["type"] = null; }
        if(this.checkNull(this.option["time"]) || !(this.option["time"].length >= 9  && this.option["time"].length <= 10) ) {
            let date = new Date();
            this.option["time"] = `${date.getFullYear()}${('0'+(date.getMonth()+1)).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0'+ date.getHours()).slice(-2)}`;
        }
        if(this.checkNull(this.option["length"])) { this.option["length"] = this.config.getConfig().programLength; }
        if(this.checkNull(this.option["ch"])) { this.option["ch"] = null; }

        this.getProgramListSql.execute(this.option, (rows) => {
            this.results = {}
            let genres = rows[0];
            let channel = rows[1];
            let time = rows.pop();

            let recorded = {};
            rows[2].map((rec: { [key: string]: any }) => {
                recorded[rec["program_id"]] = true;
            });


            let programs: { [key: string]: any }[] = [];
            //単局表示
            if(channel.length == 1) {
                for(let i = 3; i < rows.length; i++) {
                    let program: { [key: string]: any }[] = [];
                    rows[i].map((pr: { [key: string]: any }) => {
                        if(pr["eid"] != -1) {
                            pr["recorded"] = (recorded[pr["id"]] == true);
                            program.push(pr);
                        }
                    });

                    programs.push(program);
                }
            } else {
                channel.map((ch: { [key: string]: any },) => {
                    let program: { [key: string]: any }[] = [];
                    rows[3].map((pr: { [key: string]: any }) => {
                        if( pr["channel_disc"] == ch["channel_disc"] && pr["eid"] != -1) {
                            pr["recorded"] = (recorded[pr["id"]] == true);
                            program.push(pr);
                        }
                    });

                    programs.push(program);
                });
            }

            this.results = {
                genres: genres,
                subGenre: SubGenreModule.getAllSubGenre(),
                time: time,
                channel: channel,
                program: programs
            }

            this.eventsNotify();
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }
}

export default ProgramModel;


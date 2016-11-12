"use strict";

import ApiModel from '../ApiModel';
import Sql from '../../../Sql/Sql';
import EpgrecOperater from '../../../EpgrecOperater/EpgrecOperater'

class SearchModel extends ApiModel {
    private getSearchResultConfigSql: Sql;
    private searchEpgrecOperater: EpgrecOperater;

    constructor(
        _getSearchResultConfigSql: Sql,
        _searchEpgrecOperater: EpgrecOperater
    ) {
        super();
        this.getSearchResultConfigSql = _getSearchResultConfigSql;
        this.searchEpgrecOperater = _searchEpgrecOperater;
    }

    public execute(): void {
        this.checkOptionVlue("search");
        this.checkOptionVlue("use_regexp");
        this.checkOptionVlue("collate_ci");
        this.checkOptionVlue("ena_title");
        this.checkOptionVlue("ena_desc");
        this.checkOptionVlue("channel_id");
        this.checkOptionVlue("typeGR");
        this.checkOptionVlue("typeBS");
        this.checkOptionVlue("typeCS");
        this.checkOptionVlue("typeEX");
        this.checkOptionVlue("category_id");
        this.checkOptionVlue("first_genre");
        this.checkOptionVlue("sub_genre");
        this.checkOptionVlue("prgtime");
        this.checkOptionVlue("period");
        this.checkOptionVlue("week0");
        this.checkOptionVlue("week1");
        this.checkOptionVlue("week2");
        this.checkOptionVlue("week3");
        this.checkOptionVlue("week4");
        this.checkOptionVlue("week5");
        this.checkOptionVlue("week6");

        this.getSearchResultConfigSql.execute({}, (rows) => {
            let channels = {};
            rows[0].map((channel: { [key: string]: any }) => {
                channels[channel["id"]] = channel;
            });

            let recordeds = {};
            rows[1].map((rec: { [key: string]: any }) => {
                recordeds[rec["program_id"]] = true;
            });

            this.searchEpgrecOperater.execute(this.option, (value) => {
                let json = JSON.parse(value);
                let programs: { [key: string]: any }[] = [];

                json.map((program: { [key: string]: any }) => {
                    let id = Number(program["id"]);
                    let channel_name = channels[Number(program["channel_id"])].name;
                    let type = channels[Number(program["channel_id"])].type;
                    let title = program["title"];
                    let description = program["description"];
                    let category_id = Number(program["category_id"]);
                    let sub_genre = Number(program["sub_genre"]);
                    let starttime = this.createTime(program["starttime"]);
                    let endtime = this.createTime(program["endtime"]);
                    let autorec = Number(program["autorec"]);
                    let recorded = (typeof recordeds[id] != "undefined") ? true : false;
                    programs.push({
                        id: id,
                        channel_name: channel_name,
                        channel_id: Number(program["channel_id"]),
                        type: type,
                        title: title,
                        description: description,
                        category_id: category_id,
                        sub_genre: sub_genre,
                        starttime: starttime,
                        endtime: endtime,
                        autorec: autorec,
                        recorded: recorded
                    })
                });

                this.results = { status: "completed", program: programs };
                this.eventsNotify();
            },
            () => {
                this.results = { status: "error" };
                this.eventsNotify();
            });
        },
        (code) => {
            this.errors = code;
            this.eventsNotify();
        });
    }

    private checkOptionVlue(name: string): void {
        if(typeof this.option[name] == "undefined") { delete this.option[name] }
    }

    private createTime(str: string): Date {
        return new Date(str.replace(" ", "T") + "+09:00")
    }
}

export default SearchModel;


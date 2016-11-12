"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';
import { ProgramApiModelInterface } from '../Program/ProgramApiModel';
import { SearchResultApiModelInterface } from '../Search/SearchResultApiModel';

interface CustomRecEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(program: { [key: string]: any },  priority: number, ts_del: boolean, discontinuity: boolean, rec_mode: number): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec の詳細約を行う
*/
class CustomRecEpgrecModuleModel extends EpgrecModuleModel implements CustomRecEpgrecModuleModelInterface {
    private programApiModel: ProgramApiModelInterface;
    private searchResultApiModel: SearchResultApiModelInterface;

    constructor(
        _programApiModel: ProgramApiModelInterface,
        _searchResultApiModel: SearchResultApiModelInterface
    ) {
        super();
        this.programApiModel = _programApiModel;
        this.searchResultApiModel = _searchResultApiModel;
    }

    /**
    * 詳細予約
    * @param program: { [key: string]: any }, 
    * @param rec_mode recMode
    * @param discontinuity discontinuity,
    * @param priority: priority,
    * @param ts_del: ts_del
    */
    public execute(program: { [key: string]: any },  priority: number, ts_del: boolean, discontinuity: boolean, rec_mode: number): void {
        let option = {};
        let starttime = new Date(program["starttime"]);
        let endtime = new Date(program["endtime"]);

        option["syear"] = starttime.getFullYear();
        option["smonth"] = starttime.getMonth() + 1;
        option["sday"] = starttime.getDate();
        option["shour"] = starttime.getHours();
        option["smin"] = starttime.getMinutes();
        option["ssec"] = starttime.getSeconds();
        option["eyear"] = endtime.getFullYear();
        option["emonth"] = endtime.getMonth() + 1;
        option["eday"] = endtime.getDate();
        option["ehour"] = endtime.getHours();
        option["emin"] = endtime.getMinutes();
        option["esec"] = endtime.getSeconds();
        option["category_id"] = program["category_id"];
        option["record_mode"] = rec_mode;
        option["title"] = program["title"];
        option["description"] = program["description"]
        option["program_id"] = program["id"];
        option["channel_id"] = program["channel_id"];
        option["discontinuity"] = discontinuity ? 1: 0;
        option["priority"] = priority;
        option["ts_del"] = ts_del ? 1: 0;

        m.request({
            method: "PUT",
            url: `/api/program/customrec`,
            data: m.route.buildQueryString(option)
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("CustomRecEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let program_id = value["program_id"];
        let program = document.getElementById("prgID_" + program_id);
        if(program == null) { return; }

        let snackbarStr = "";

        if(value["status"] == "error") {
            snackbarStr = "カスタム予約失敗 " + value["messeage"] + " ";
        } else if(value["status"] == "reload") {
            location.reload(true);
        } else {
            snackbarStr = "カスタム予約 ";
        }

        this.dialog.close();

        let route = m.route().split("?")[0];
        if(route == "/program") {
            snackbarStr += (<HTMLElement>program.children[0]).innerText;
            this.programApiModel.update(true);
        } else if(route == "/search") {
            snackbarStr += (<HTMLElement>(<HTMLElement>program.children[0]).children[0]).innerText;
            this.searchResultApiModel.update();
        }

        this.snackbar.open(snackbarStr);
    }
}

export { CustomRecEpgrecModuleModel, CustomRecEpgrecModuleModelInterface };


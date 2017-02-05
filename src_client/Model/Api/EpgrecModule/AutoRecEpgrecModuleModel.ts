"use strict";

import * as m from 'mithril';
import Util from '../../../Util/Util';
import EpgrecModuleModel from './EpgrecModuleModel';
import { ProgramApiModelInterface } from '../Program/ProgramApiModel';
import { SearchResultApiModelInterface } from '../Search/SearchResultApiModel';

interface AutoRecEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(program_id: number, autorec: boolean): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec の自動予約の許可、禁止を行う
*/
class AutoRecEpgrecModuleModel extends EpgrecModuleModel implements AutoRecEpgrecModuleModelInterface {
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
    * 予約削除
    * @param rec_id rec_id
    * @param autorec true: 自動予約禁止, false: 自動予約許可
    */
    public execute(program_id: number, autorec: boolean): void {
        let query = {
            program_id: program_id,
            autorec: autorec ? 1 : 0
        };

        m.request({
            method: "PUT",
            url: `/api/program/autorec`,
            data: m.buildQueryString(query)
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("AutoRecEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let program_id = value["program_id"];
        let autorec = value["autorec"];
        let program = document.getElementById("prgID_" + program_id);;
        if(program == null) { return; }

        this.dialog.close();

        let snackbarStr = autorec == 1 ? "自動予約禁止 " : "自動予約許可 ";

        let route = Util.getRoute();
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

export { AutoRecEpgrecModuleModel, AutoRecEpgrecModuleModelInterface };


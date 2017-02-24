"use strict";

import * as m from 'mithril';
import Util from '../../../Util/Util';
import EpgrecModuleModel from './EpgrecModuleModel';
import { ProgramApiModelInterface } from '../Program/ProgramApiModel';
import { SearchResultApiModelInterface } from '../Search/SearchResultApiModel';

interface CancelRecEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(program_id: number, autorec: boolean): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec の予約削除操作を行う
*/
class CancelRecEpgrecModuleModel extends EpgrecModuleModel implements CancelRecEpgrecModuleModelInterface {
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
    * @param program_id program_id
    */
    public execute(program_id: number, autorec: boolean): void {
        let query = {
            program_id: program_id,
            autorec: autorec ? 1 : 0
        };

        m.request({
            method: "DELETE",
            url: `/api/program/cancelrec?${ m.buildQueryString(query) }`
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("CancelRecEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let program_id = value["program_id"];
        let program = document.getElementById("prgID_" + program_id);;
        if(program == null) { return; }

        let snackbarStr = "予約削除 ";

        if(value["status"] == "error") {
            snackbarStr = "予約削除失敗 " + value["messeage"] + " ";
        } else if(value["status"] == "reload") {
            location.reload(true);
        }

        this.dialog.close();

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

export { CancelRecEpgrecModuleModel, CancelRecEpgrecModuleModelInterface };


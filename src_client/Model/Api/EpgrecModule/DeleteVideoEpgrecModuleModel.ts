"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';
import { RecordedApiModelInterface } from '../Recorded/RecordedApiModel';

interface DeleteVideoEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(rec_id: number): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* epgrec のビデオ削除を行う
*/
class DeleteVideoEpgrecModuleModel extends EpgrecModuleModel implements DeleteVideoEpgrecModuleModelInterface {
    private recordedApiModel: RecordedApiModelInterface;

    constructor(_recordedApiModel: RecordedApiModelInterface) {
        super();
        this.recordedApiModel = _recordedApiModel;
    }

    /**
    * ビデオ削除
    * @param rec_id rec_id
    */
    public execute(rec_id: number): void {
        m.request({
            method: "DELETE",
            url: `/api/recorded/video?rec_id=${rec_id}&delete_file=1`
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("DeleteVideoEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let rec_id = Number(value["rec_id"]);
        let program: { [key: string]: any } | null = null;

        this.recordedApiModel.getRecordedList().map((data: { [key: string]: any }) => {
            if(data["id"] == rec_id) {
                program = data;
            }
        });
        if(program == null) { return; }

        let snackbarStr = "";
        if(value["status"] == "error") {
            snackbarStr = "ビデオ削除失敗 " + value["messeage"] + " " + program["title"];
        } else {
            snackbarStr = "ビデオ削除 " + program["title"];
        }
        this.recordedApiModel.update();

        this.dialog.close();
        this.snackbar.open(snackbarStr);
    }
}

export { DeleteVideoEpgrecModuleModel, DeleteVideoEpgrecModuleModelInterface };


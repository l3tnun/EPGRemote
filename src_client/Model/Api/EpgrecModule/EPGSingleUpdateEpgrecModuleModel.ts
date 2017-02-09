"use strict";

import * as m from 'mithril';
import EpgrecModuleModel from './EpgrecModuleModel';
import { ProgramApiModelInterface } from '../Program/ProgramApiModel';

interface EPGSingleUpdateEpgrecModuleModelInterface extends EpgrecModuleModel {
    execute(channel_disc: string): void;
    viewUpdate(value: { [key: string]: any; }): void;
}

/**
* EPG の単局更新を行う
*/
class EPGSingleUpdateEpgrecModuleModel extends EpgrecModuleModel implements EPGSingleUpdateEpgrecModuleModelInterface {
    private programApiModel: ProgramApiModelInterface;

    constructor(_programApiModel: ProgramApiModelInterface) {
        super();
        this.programApiModel = _programApiModel;
    }

    /**
    * 予約削除
    * @param channel_disc: channel disc
    */
    public execute(channel_disc: string): void {
        m.request({
            method: "GET",
            url: `/api/epg?${ m.buildQueryString({ channel_disc: channel_disc }) }`
        })
        .then((_value) => {
            //this.viewUpdate(_value);
        },
        (error) => {
            console.log("EPGSingleUpdateEpgrecModuleModel error.");
            console.log(error);
        });
    }

    public viewUpdate(value: { [key: string]: any; }): void {
        super.viewUpdate(value);
        let channels = this.programApiModel.getChannel();
        if(channels == null) { return; }

        let channel: { [key: string]: any } | null = null;
        channels.map((c: { [key: string]: any },) => {
            if(c["channel_disc"] == value["channel_disc"]) { channel = c; }
        });
        if(channel == null) { return; }

        let snackbarStr = value["status"] == "error" ? "EPG更新失敗 " + value["messeage"] + " " : "EPG更新開始 ";
        snackbarStr += channel["name"];

        this.dialog.close();
        this.snackbar.open(snackbarStr);
    }
}

export { EPGSingleUpdateEpgrecModuleModel, EPGSingleUpdateEpgrecModuleModelInterface };


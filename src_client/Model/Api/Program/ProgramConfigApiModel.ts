"use strict";

import * as m from 'mithril';
import ApiModel from '../ApiModel';

interface ProgramConfigApiModelInterface extends ApiModel {
    update(): void;
    getRecMode(): { [key: string]: any }[];
    getStartTranscodeId(): number | null;
    getRecModeDefaultId(): number | null;
    getTabletViewConfig(): { [key: string]: any };
    getMobileViewConfig(): { [key: string]: any };
}

/**
* /program で必要な config を取得
*/
class ProgramConfigApiModel implements ProgramConfigApiModelInterface {
    private recMode: { [key: string]: any }[] = [];
    private startTranscodeId: number | null = null;
    private recModeDefaultId: number | null = null;
    private tabletViewConfig: { [key: string]: any };
    private mobileViewConfig: { [key: string]: any };

    /**
    * /program で必要な config を取得
    */
    public update(): void {
        m.request({method: "GET", url: `/api/program/config`})
        .then((value) => {
            this.recMode = value["recMode"];
            this.startTranscodeId = value["startTranscodeId"];
            this.recModeDefaultId = value["recModeDefaultId"];
            this.tabletViewConfig = value["programViewConfig"]["tablet"];
            this.mobileViewConfig = value["programViewConfig"]["mobile"];
        },
        (error) => {
            console.log("ProgramConfigApiModel update error");
            console.log(error);
        });
    }

    public getRecMode(): { [key: string]: any }[] {
        return this.recMode;
    }

    public getStartTranscodeId(): number | null {
        return this.startTranscodeId;
    }

    public getRecModeDefaultId(): number | null {
        return this.recModeDefaultId;
    }

    public getTabletViewConfig(): { [key: string]: any } {
        return this.tabletViewConfig;
    }

    public getMobileViewConfig(): { [key: string]: any } {
        return this.mobileViewConfig;
    }
}

export { ProgramConfigApiModelInterface, ProgramConfigApiModel };


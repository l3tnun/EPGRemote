"use strict";

import ApiModel from '../ApiModel';

interface ProgramConfigApiModelInterface {
    update(): void;
    getRecMode(): { [key: string]: any }[];
    getStartTranscodeId(): number | null;
    getRecModeDefaultId(): number | null;
    getTabletViewConfig(): { [key: string]: number } | null;
    getMobileViewConfig(): { [key: string]: number } | null;
}

/**
* /program で必要な config を取得
*/
class ProgramConfigApiModel extends ApiModel implements ProgramConfigApiModelInterface {
    private recMode: { [key: string]: any }[] = [];
    private startTranscodeId: number | null = null;
    private recModeDefaultId: number | null = null;
    private tabletViewConfig: { [key: string]: number } | null = null;
    private mobileViewConfig: { [key: string]: number } | null = null;

    /**
    * /program で必要な config を取得
    */
    public update(): void {
        this.getRequest({ method: "GET", url: `/api/program/config` },
        (value: {}) => {
            this.recMode = value["recMode"];
            this.startTranscodeId = value["startTranscodeId"];
            this.recModeDefaultId = value["recModeDefaultId"];
            this.tabletViewConfig = value["programViewConfig"]["tablet"];
            this.mobileViewConfig = value["programViewConfig"]["mobile"];
        },
        "ProgramConfigApiModel update error");
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

    public getTabletViewConfig(): { [key: string]: number } | null{
        return this.tabletViewConfig;
    }

    public getMobileViewConfig(): { [key: string]: number } | null {
        return this.mobileViewConfig;
    }
}

export { ProgramConfigApiModelInterface, ProgramConfigApiModel };


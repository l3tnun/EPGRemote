"use strict";

/// <reference path="../../../extendedTypings/HLS.d.ts" />

import Model from '../Model';

interface HlsModelInterface extends Model {
    create(): Hls;
    destroy(): void;
}

/**
* Hls オブジェクトの管理をする
*/
class HlsModel implements HlsModelInterface {
    private hlsObject: Hls | null = null;

    public create(): Hls {
        if(this.hlsObject != null) { this.destroy(); }

        this.hlsObject = new Hls();
        return this.hlsObject;
    }

    public destroy(): void {
        if(this.hlsObject == null) { return; }
        this.hlsObject.destroy();
        this.hlsObject = null;
    }
}

export { HlsModelInterface, HlsModel };


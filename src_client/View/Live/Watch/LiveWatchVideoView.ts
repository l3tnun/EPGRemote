"use strict";

/// <reference path="../../../../extendedTypings/HLS.d.ts" />

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../../View';
import Util from '../../../Util/Util';
import LiveWatchVideoViewModel from '../../../ViewModel/Live/Watch/LiveWatchVideoViewModel';

/**
* LiveWatchVideo の View
*/
class LiveWatchVideoView extends View {
    private viewModel: LiveWatchVideoViewModel;
    private streamId: string;

    public execute(): Vnode<any, any> {
        this.streamId = m.route.param("stream");
        this.viewModel = <LiveWatchVideoViewModel>this.getModel("LiveWatchVideoViewModel");

        if(this.viewModel.getShowStatus()) {
            //video 表示
            return m("video", {
                preload: "none",
                height: "$auto",
                width: "100%",
                controls: " ",
                playsinline: " ",
                oncreate: (vnode: VnodeDOM<any, any>) => {
                    //set source
                    (<HTMLMediaElement>(vnode.dom)).src = this.getSource();

                    //HLS.js
                    //Edge では HLS.js が動作しない
                    if(Hls.isSupported() && !Util.uaIsEdge() && typeof this.streamId != "undefined") {
                        let hls = this.viewModel.createHls();
                        hls.loadSource("streamfiles/stream" + this.streamId + ".m3u8");
                        hls.attachMedia(vnode.dom);
                        hls.on(Hls.Events.MANIFEST_PARSED, () =>{
                            (<HTMLMediaElement>(vnode.dom)).play();
                        });

                        return;
                    }

                    //error 処理追加
                    (<HTMLMediaElement>(vnode.dom)).addEventListener('error', () => {
                        if((<HTMLMediaElement>(vnode.dom)).src.indexOf("/api/live/http/watch") == -1) {
                            return;
                        }
                        Util.reload();
                    }, true);

                    //再生
                    try {
                        (<HTMLMediaElement>(vnode.dom)).load();
                        (<HTMLMediaElement>(vnode.dom)).play();
                    } catch(e) {
                        console.log(e);
                    }
                },
                onupdate: (vnode: VnodeDOM<any, any>) => {
                    if(m.route.param("stream") != null) { return; }
                    let src = (<HTMLMediaElement>(vnode.dom)).src;
                    if(src != location.href.split("#")[0].slice(0, -1) + this.getSource()) {
                        try {
                            (<HTMLMediaElement>(vnode.dom)).pause();
                        } catch(e) {
                            console.log(e);
                        }
                        try {
                            (<HTMLMediaElement>(vnode.dom)).src = this.getSource();
                            (<HTMLMediaElement>(vnode.dom)).load();
                            (<HTMLMediaElement>(vnode.dom)).play();
                        } catch(e) {
                            console.log(e);
                        }
                    }
                },
                onremove: (vnode: VnodeDOM<any, any>) => {
                    try {
                        (<HTMLMediaElement>(vnode.dom)).pause();
                        (<HTMLMediaElement>(vnode.dom)).src = "";
                        (<HTMLMediaElement>(vnode.dom)).load();
                    } catch(e) {
                        console.log(e);
                    }

                    if(typeof this.streamId == "undefined") { return; }
                    this.viewModel.HlsDestroy();
                }
            });
        } else {
            //video 非表示
            return m("div", {
                id: LiveWatchVideoViewModel.videoPlayerId,
                class: "video_player_background",
                oncreate: () => { setTimeout(() => { this.viewModel.updateVideoStatus(); }, 1000); },
                onupdate: () => { setTimeout(() => { this.viewModel.updateVideoStatus(); }, 1000); }
            },[
                m("div", {
                    id: "video_loading",
                    class: "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"
                })
            ]);
        }
    }

    private getSource(): string {
        if(typeof this.streamId == "undefined") {
            let query = Util.getCopyQuery();
            query["pc"] = 1;

            return `/api/live/http/watch?${ Util.buildQueryStr(query) }`;
        }

        return `streamfiles/stream${ this.streamId }.m3u8`;
    }
}

export default LiveWatchVideoView;


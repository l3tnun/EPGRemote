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

    public execute(): Vnode<any, any> {
        let streamId = m.route.param("stream");
        this.viewModel = <LiveWatchVideoViewModel>this.getModel("LiveWatchVideoViewModel");

        if(this.viewModel.getShowStatus()) {
            //video 表示
            return m("video", {
                src: `streamfiles/stream${streamId}.m3u8`,
                preload: "none",
                height: "$auto",
                width: "100%",
                controls: " ",
                playsinline: " ",
                oncreate: (vnode: VnodeDOM<any, any>) => {
                    //HLS.js
                    //Edge では HLS.js が動作しない
                    if(Hls.isSupported() && !Util.uaIsEdge()) {
                        let hls = this.viewModel.createHls();
                        hls.loadSource("streamfiles/stream" + streamId + ".m3u8");
                        hls.attachMedia(vnode.dom);
                        hls.on(Hls.Events.MANIFEST_PARSED, () =>{
                            (<HTMLMediaElement>(vnode.dom)).play();
                        });

                        return;
                    }

                    //再生
                    (<HTMLMediaElement>(vnode.dom)).load();
                    (<HTMLMediaElement>(vnode.dom)).play();
                },
                onremove: (vnode: VnodeDOM<any, any>) => {
                    (<HTMLMediaElement>(vnode.dom)).pause();
                    (<HTMLMediaElement>(vnode.dom)).src = "";
                    (<HTMLMediaElement>(vnode.dom)).load();
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
}

export default LiveWatchVideoView;


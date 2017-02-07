"use strict";

/// <reference path="../../../../extendedTypings/HLS.d.ts" />

import * as m from 'mithril';
import View from '../../View';
import Util from '../../../Util/Util';
import LiveWatchVideoViewModel from '../../../ViewModel/Live/Watch/LiveWatchVideoViewModel';

/**
* LiveWatchVideo の View
*/
class LiveWatchVideoView extends View {
    private viewModel: LiveWatchVideoViewModel;

    public execute(): Mithril.Vnode<any, any> {
        let streamId = m.route.param("stream");
        this.viewModel = <LiveWatchVideoViewModel>this.getModel("LiveWatchVideoViewModel");

        if(this.viewModel.getShowStatus()) {
            //video 表示
            return m("div", {
                onupdate: (vnode: Mithril.VnodeDOM<any, any>) => {
                    if(vnode.dom.children.length > 0) { return; }

                    //video 要素の生成 (Mithril の管理外にするため)
                    //他の View から Mithril で描画されると再生が止まるため Mithril の管理外にする
                    let video = document.createElement('video');
                    video.setAttribute("src", `streamfiles/stream${streamId}.m3u8`);
                    video.setAttribute("preload", "none");
                    video.setAttribute("height", "$auto");
                    video.setAttribute("width", "100%");
                    video.setAttribute("controls", " ");
                    video.setAttribute("playsinline", "");
                    vnode.dom.appendChild(video);

                    //HLS.js
                    //Edge では HLS.js が動作しない
                    //Android では一部のチャンネルで音が途切れる
                    if(Hls.isSupported() && !Util.uaIsEdge() && !Util.uaIsAndroid()) {
                        let hls = this.viewModel.createHls();
                        hls.loadSource("streamfiles/stream" + streamId + ".m3u8");
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, () =>{
                            video.play();
                        });

                        return;
                    }

                    //再生
                    (<HTMLMediaElement>video).load();
                    (<HTMLMediaElement>video).play();
                }
            });
        } else {
            //video 非表示
            return m("div", {
                id: LiveWatchVideoViewModel.videoPlayerId,
                class: "video_player_background"
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


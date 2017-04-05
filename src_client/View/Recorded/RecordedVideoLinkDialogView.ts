"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../View';
import RecordedVideoLinkDialogViewModel from '../../ViewModel/Recorded/RecordedVideoLinkDialogViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';

class RecordedVideoLinkDialogView extends View {
    private viewModel: RecordedVideoLinkDialogViewModel;
    private dialog: DialogViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <RecordedVideoLinkDialogViewModel>this.getModel("RecordedVideoLinkDialogViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        let links = this.viewModel.getLink();
        if(links == null) { return m("div"); }

        //title
        let title = this.viewModel.getDlStatus() ? "ダウンロードリンク" : "ビデオリンク";

        return m("div", { class: "recorded-video-link-dialog-frame" }, [
            m("div", { class: "recorded-video-link-title" }, title),

            //配信設定セレクタ
            this.createVideoSelector(),

            //動画リンク
            links.map((videoLink: { [key: string]: any }) => {
                let status = videoLink["status"];
                let name = this.createVideoLinkName(videoLink["name"], status);
                let href = status == 2 ? this.createHref(videoLink["path"]) : null;

                let result: Vnode<any, any>[] = [];
                //ビデオリンクボタン
                result.push(this.createVideoLinkButton(name, href));

                //配信用ボタン
                if(status == 2 && !this.viewModel.getDlStatus() && this.viewModel.getStreamStatus()) {
                    result.push(this.createStreamLink(videoLink["id"], videoLink["type"]));
                }

                result.push( m("div") );

                return result;
            })
        ]);
    }

    //配信用ビデオセレクタ
    private createVideoSelector(): Vnode<any, any> {
        //録画配信が有効でない or ダウンロードなら表示しない
        if(!this.viewModel.getStreamStatus() || this.viewModel.getDlStatus()) { return m("div"); }

        return m("div", { class: "pulldown mdl-layout-spacer", style: "width: 100%;" }, [
            m("select", {
                value: this.viewModel.videoSelectorValue,
                oncreate: (vnode: VnodeDOM<any, any>) => {
                    if(this.viewModel.videoSelectorValue == null) { return; }
                    this.selectConfig((<HTMLInputElement>(vnode.dom)), this.viewModel.videoSelectorValue);
                },
                onchange: m.withAttr("value", (value) => { this.viewModel.videoSelectorValue = Number(value); }),
                onupdate: (vnode: VnodeDOM<any, any>) => {
                    let video = this.viewModel.videoSelectorValue;
                    if(video == null) { return; }
                    this.selectConfig(<HTMLInputElement>(vnode.dom), video);
                }
            }, [
                this.viewModel.getVideoConfig().map((config: { [key: string]: any }) => {
                    if(this.viewModel.videoSelectorValue == null) {
                        this.viewModel.videoSelectorValue = <number>(config["id"]);
                    }
                    return m("option", { value: config["id"] }, config["name"]);
                })
            ])
        ]);
    }

    //video href を生成する
    private createHref(path: string): string {
        let iOSURL = this.viewModel.getiOSURL();
        let androidURL = this.viewModel.getAndroidURL();
        let windowsURL = this.viewModel.getWindowsURL();
        let dlStatus = this.viewModel.getDlStatus();

        if(dlStatus) { path += "?mode=download"; }

        //windows かつ IE or Edge
        if(windowsURL != null) {
            if(dlStatus) { return path; }
            let url = windowsURL!["RecordedStreamingWindowsURL"];
            return typeof url == "undefined" ? path : url.replace("ADDRESS", window.location.host + path);
        }
        //非 Mobile 端末
        else if(iOSURL == null && androidURL == null) {  return path; }

        //Mobile 端末
        let mobilePath = window.location.host + path;
        let url: string;
        if(dlStatus) {
            url = iOSURL != null ? iOSURL!["RecordedDownloadiOSURL"] : androidURL!["RecordedDownloadAndroidURL"]
        } else {
            url = iOSURL != null ? iOSURL!["RecordedStreamingiOSURL"] : androidURL!["RecordedStreamingAndroidURL"];
        }

        //iOS vlc x-callbak 用処理
        if(typeof url != "undefined" && iOSURL != null && url.match(/vlc-x-callback/)) { mobilePath = encodeURI(window.location.host + path); }

        return typeof url == "undefined" ? path : url.replace("ADDRESS", mobilePath);
    }

    //ビデオリンクの名前を生成する
    private createVideoLinkName(name: string, status: number): string {
        let str = RecordedVideoLinkDialogView.videoStatus[status]

        return str == null ? name : name + " : " + str;
    }

    //ビデオリンクを生成する
    private createVideoLinkButton(name: string, href: string | null): Vnode<any, any> {
        let buttonClass = (!this.viewModel.getDlStatus() && this.viewModel.getStreamStatus() ) ? "recorded-video-view-link-button" : "recorded-video-dl-link-button";

        if(href == null) {
            return m("button", {
                class: `${ buttonClass } recorded-video-not-link-button mdl-button mdl-js-button mdl-button--raised`
            }, name);
        }

        return m("button", {
            class: `${ buttonClass } mdl-button mdl-js-button mdl-button--raised`,
            onclick: () => {
                this.dialog.close();
                setTimeout(() => {
                    location.href = href;
                }, 100);
            }
        }, name);
    }

    private createStreamLink(id: number, type: number): Vnode<any, any> {
        //配信用リンク
        return m("label", {
            class: "mdl-button mdl-js-button mdl-button--icon",
            onclick: () => {
                //配信処理
                this.viewModel.startStream(id, type);
                this.dialog.close();
            }
        }, m("i", { class: "material-icons" }, "live_tv"));
    }
}

namespace RecordedVideoLinkDialogView {
    export const videoStatus = {
        0: "変換待ち",
        1: "変換中",
        2: null,
        3: "変換失敗"
    }
}

export default RecordedVideoLinkDialogView;


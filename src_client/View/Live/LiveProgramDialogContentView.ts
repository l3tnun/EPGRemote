"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import Util from '../../Util/Util';
import View from '../View';
import LiveProgramDialogContentViewModel from '../../ViewModel/Live/LiveProgramDialogContentViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import SnackbarViewModel from '../../ViewModel/Snackbar/SnackbarViewModel';

/**
* LiveProgramDialogContent View
*/
class LiveProgramDialogContentView extends View {
    private dialogContentViewModel: LiveProgramDialogContentViewModel;
    private dialogViewModel: DialogViewModel;
    private snackbarViewModel: SnackbarViewModel;

    public execute(): Vnode<any, any> {
        this.dialogContentViewModel = <LiveProgramDialogContentViewModel>this.getModel("LiveProgramDialogContentViewModel");
        this.dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");
        this.snackbarViewModel = <SnackbarViewModel>this.getModel("SnackbarViewModel");

        return m("div", [
            //title
            m("div", {
                class: "program-station-name" ,
                style: "text-align: left; padding-left: 14px; padding-top: 22px; margin-bottom: 16px;"
            }, [ this.dialogContentViewModel.getTitle() ]),

            //pulldown
            m("div", { style: "margin: 0px 16px; text-align: center;" }, [
                this.tunerPulldown(),
                this.videoPulldown()
            ]),

            //HLS と http 切り替え
            this.createHttpCheckBox(),

            //下部ボタン
            m("div", {
                class: "mdl-dialog__actions",
                style: "padding-left: 8px; margin-top: 8px;"
            }, [
                //開始ボタン
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--primary",
                    style: "padding: 0px 6px;",
                    onclick: () => { this.start(); }
                }, "開始"),

                //閉じる
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--accent",
                    style: "padding: 0px 6px;",
                    onclick: () => { this.dialogViewModel.close(); }
                }, "閉じる"),

                m("div", { class: "mdl-layout-spacer" }),

                //単局表示、EPG更新ボタン、新規ストリームボタン
                this.createSubButton()
            ])
        ]);
    }

    //tuner pulldown の生成
    private tunerPulldown(): Vnode<any, any> {
        return m("div", { style: "display: flex; width: 50%; float: left;" }, [
            m("div", { class: "pulldown mdl-layout-spacer" }, [
                m("select", { id: LiveProgramDialogContentView.tunerPullDownId }, [
                    this.createPulldownContent(this.dialogContentViewModel.getTunerList(this.dialogContentViewModel.getStreamNumber()))
                ])
            ])
        ]);
    }

    //video pulldown の生成
    private videoPulldown(): Vnode<any, any> {
        return m("div", { style: "display: flex; width: 50%;" }, [
            m("div", { class: "pulldown mdl-layout-spacer" }, [
                m("select", { id: LiveProgramDialogContentView.videoPullDownId }, [
                    this.createPulldownContent(this.dialogContentViewModel.getVideoList())
                ])
            ])
        ]);
    }

    /**
    * pulldown の中身を生成する
    * @param array { id: 1, name: "hoge" } の形になっている array
    */
    private createPulldownContent(array: any[]): Vnode<any, any>[] {
        return array.map((data: { [key: string]: any }) => {
            return m("option", { value: `${ data["id"] }` }, data["name"] )
        });
    }

    //tuner pulldown の value を取得
    private getTunerPullDownValue(): number | null {
        let value = (<HTMLInputElement>document.getElementById(LiveProgramDialogContentView.tunerPullDownId)).value;
        return value == "" ? null : Number(value);
    }

    //video pulldown の value を取得
    private getVideoPullDownValue(): number {
        let value = (<HTMLInputElement>document.getElementById(LiveProgramDialogContentView.videoPullDownId)).value;
        return Number(value);
    }

    // 配信開始
    private start(): void {
        let tuner = this.getTunerPullDownValue();
        let video = this.getVideoPullDownValue();
        let streamNum = this.dialogContentViewModel.getStreamNumber();

        //チャンネル変更か調べる
        let changeFlg = false;
        if(streamNum != null) {
            this.dialogContentViewModel.getTunerList(streamNum).map((data: { [key: string]: any }) => {
                if(data["id"] == tuner && data["streamId"] == this.dialogContentViewModel.getStreamNumber() && m.route.param("stream") != null) {
                    changeFlg = true;
                }
            });
        }

        //tuner が無いとき
        if(tuner == null) {
            this.snackbarViewModel.open("チューナーの空きがありません");
            this.dialogViewModel.close();
            return;
        }

        if((changeFlg || !this.dialogContentViewModel.enableNewStream) && streamNum != null && m.route.param("stream") != null) {
            //HLS チャンネル変更
            this.dialogContentViewModel.changeStream(tuner, video, streamNum);
        } else if(this.dialogContentViewModel.enableHLSLive() && !this.dialogContentViewModel.changeHttpView) {
            //HLS 新規ストリーム開始
            this.dialogContentViewModel.startStream(tuner, video);
        } else if(this.dialogContentViewModel.enableHttpPCLive() && !Util.uaIsiOS() && !Util.uaIsAndroid()) {
            //http pc 新規ストリーム
            this.dialogViewModel.close();

            let href = this.dialogContentViewModel.createHttpPCLiveLink(tuner!, video);
            setTimeout(() => {
                if(href == null) {
                    this.snackbarViewModel.open("現在の設定と同じです。");
                } else {
                    m.route.set(href);
                }
            }, 500);
        } else if(this.dialogContentViewModel.enableHttpLive()){
            //http 新規ストリーム開始
            this.dialogViewModel.close();

            let href = this.dialogContentViewModel.createHttpLiveLink(tuner, video);
            if(href != null) {
                setTimeout(() => { location.href = href!; }, 200);
            } else if(Util.uaIsiOS()) {
                alert("HttpLiveViewiOSURL の設定をしてください。");
            } else if(Util.uaIsAndroid()) {
                alert("HttpLiveViewAndroidURL の設定をしてください。");
            } else {
                alert(`お使いの端末は http 再生に対応していません。`);
            }
        }

        this.dialogViewModel.close();
    }

    //HLS と http 切り替えチェックボックス
    private createHttpCheckBox(): Vnode<any, any> | null {
        if(location.href.indexOf("/live/watch") != -1) { return null; }
        else {
            let method = 0;
            if(this.dialogContentViewModel.enableHLSLive()) { method += 1; }
            if(this.dialogContentViewModel.enableHttpLive()) { method += 1; }
            if(this.dialogContentViewModel.enableHttpPCLive()) { method += 1; }

            if(method <= 1) { return null; }
        }

        return m("label", {
            class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect",
            style: "width: auto; height: 24px; top: 12px; left: 18px;"
        }, [
            m("input", {
                type: "checkbox",
                class: "mdl-checkbox__input",
                checked: this.dialogContentViewModel.changeHttpView,
                onchange: m.withAttr("checked", (value) => {
                    this.dialogContentViewModel.changeHttpView = value;
                    this.dialogContentViewModel.configListUpdate();
                }),
                onreate: () => { this.checkboxInit(); },
                onupdate: (vnode: VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
            }),
            m("span", { class: "mdl-checkbox__label" }, "http 配信")
        ]);
    }

    //単局、EPG 更新ボタン、新規ストリームチェックボックス
    private createSubButton():  Vnode<any, any>[] {
        if(location.href.indexOf("/program") > 0 && location.href.indexOf("/live") == -1 && typeof m.route.param("ch") == "undefined") {
            //番組表
            let query = typeof m.route.param("time") == "undefined" ? {} : { time: m.route.param("time") };
            query["ch"] = this.dialogContentViewModel.getChannelDisk();

            return [
                //EPG 更新
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--primary",
                    style: "padding: 0px 6px;",
                    onclick: () => {
                        //EPG updae
                        this.dialogContentViewModel.epgUpdate();
                        this.dialogViewModel.close();
                    }
                }, "EPG更新"),

                //単局表示
                m("button", {
                    class: "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect",
                    style: "padding: 0 6px; margin: 0;",
                    onclick: () => {
                        this.dialogViewModel.close();
                        setTimeout(() => {
                            m.route.set("/program", query)
                        }, 100);
                    }
                }, "単局表示" )
            ];

        } else if(m.route.param("stream") != null) {
            //視聴時
            return [
                m("label", {
                    class: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect",
                    style: "width: auto; top: 5px; left: 10px;"
                }, [
                    m("input", {
                        type: "checkbox",
                        class: "mdl-checkbox__input",
                        checked: this.dialogContentViewModel.enableNewStream,
                        onchange: m.withAttr("checked", (value) => {
                            this.dialogContentViewModel.enableNewStream = value;
                        }),
                        onreate: () => { this.checkboxInit(); },
                        onupdate: (vnode: VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
                    }),
                    m("span", { class: "mdl-checkbox__label" }, "新規ストリーム")
                ])
            ];
        } else {
            return [ m("div", { style: "display: none;" }) ];
        }
    }
}

namespace LiveProgramDialogContentView {
    export const tunerPullDownId = "tunerPullDown";
    export const videoPullDownId = "videoPullDown";
}

export default LiveProgramDialogContentView;


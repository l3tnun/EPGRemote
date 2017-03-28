"use strict";

import * as m from 'mithril';
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

    public execute(): Mithril.Vnode<any, any> {
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
    private tunerPulldown(): Mithril.Vnode<any, any> {
        return m("div", { style: "display: flex; width: 50%; float: left;" }, [
            m("div", { class: "pulldown mdl-layout-spacer" }, [
                m("select", { id: LiveProgramDialogContentView.tunerPullDownId }, [
                    this.createPulldownContent(this.dialogContentViewModel.getTunerList(this.getStreamNumber()))
                ])
            ])
        ]);
    }

    //ページのstreamnumber を取得する
    private getStreamNumber(): number | null {
        let num = m.route.param("stream");
        if(typeof num == "undefined") { return null; }
        return Number(num);
    }

    //video pulldown の生成
    private videoPulldown(): Mithril.Vnode<any, any> {
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
    private createPulldownContent(array: any[]): Mithril.Vnode<any, any>[] {
        return array.map((data: { [key: string]: any }) => {
            return m("option", { value: data["id"] }, data["name"] )
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
        let streamNum = this.getStreamNumber();

        //チャンネル変更か調べる
        let changeFlg = false;
        if(streamNum != null) {
            this.dialogContentViewModel.getTunerList(streamNum).map((data: { [key: string]: any }) => {
                if(data["id"] == tuner && data["streamId"] == this.getStreamNumber()) {
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

        if((changeFlg || !this.dialogContentViewModel.enableNewStream) && streamNum != null) {
            //チャンネル変更
            this.dialogContentViewModel.changeStream(tuner, video, streamNum);
        } else {
            //新規ストリーム開始
            this.dialogContentViewModel.startStream(tuner, video);
        }

        this.dialogViewModel.close();
    }

    //HLS と http 切り替えチェックボックス
    private createHttpCheckBox(): Mithril.Vnode<any, any> | null {
        if(!this.dialogContentViewModel.enableHttpLive() || !this.dialogContentViewModel.enableHLSLive()) { return null; }

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
                onupdate: (vnode: Mithril.VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
            }),
            m("span", { class: "mdl-checkbox__label" }, "http 配信")
        ]);
    }

    //単局、EPG 更新ボタン、新規ストリームチェックボックス
    private createSubButton():  Mithril.Vnode<any, any>[] {
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
                        onupdate: (vnode: Mithril.VnodeDOM<any, any>) => { this.checkboxConfig(<HTMLInputElement>(vnode.dom)); }
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


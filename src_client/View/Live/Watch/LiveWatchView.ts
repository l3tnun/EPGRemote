"use strict";

import * as m from 'mithril';
import ParentPageView from '../../ParentPageView';
import Util from "../../../Util/Util";
import Scroll from "../../../Util/Scroll";
import LiveProgramCardComponent from '../../../Component/Live/LiveProgramCardComponent';
import LiveProgramDialogContentComponent from '../../../Component/Live/LiveProgramDialogContentComponent';
import LiveWatchViewModel from '../../../ViewModel/Live/Watch/LiveWatchViewModel';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';
import LiveWatchVideoComponent from '../../../Component/Live/Watch/LiveWatchVideoComponent';
import LiveWatchVideoViewModel from '../../../ViewModel/Live/Watch/LiveWatchVideoViewModel';
import LiveWatchStreamInfoComponent from '../../../Component/Live/Watch/LiveWatchStreamInfoComponent';
import LiveWatchOtherStreamInfoComponent from '../../../Component/Live/Watch/LiveWatchOtherStreamInfoComponent';
import LiveProgramAddTimeButtonComponent from '../../../Component/Live/LiveProgramAddTimeButtonComponent';

/**
* LiveWatch の View
*/
class LiveWatchView extends ParentPageView {
    private liveWatchViewModel: LiveWatchViewModel;
    private liveProgramCardViewModel: LiveProgramCardViewModel;
    private videoViewModel: LiveWatchVideoViewModel;

    private liveProgramCardComponent = new LiveProgramCardComponent();
    private liveProgramDialogContentComponent = new LiveProgramDialogContentComponent();
    private liveWatchVideoComponent = new LiveWatchVideoComponent();
    private liveWatchStreamInfoComponent = new LiveWatchStreamInfoComponent();
    private liveWatchOtherStreamInfoComponent = new LiveWatchOtherStreamInfoComponent();
    private liveProgramAddTimeButtonComponent = new LiveProgramAddTimeButtonComponent();

    public execute(): Mithril.Vnode<any, any> {
        this.liveWatchViewModel = <LiveWatchViewModel>this.getModel("LiveWatchViewModel");
        this.liveProgramCardViewModel = <LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel");
        this.videoViewModel = <LiveWatchVideoViewModel>this.getModel("LiveWatchVideoViewModel");

        return m("div", {
            class: "live-watch-mdl-layout mdl-layout mdl-js-layout mdl-layout--fixed-header",
            oncreate: () => { setTimeout(() => { this.videoViewModel.updateVideoStatus(); }, 1000); }
        }, [
            this.createHeader("視聴"),
            this.createNavigation(),
            this.createHeaderMenu(),
            m(this.liveProgramAddTimeButtonComponent),

            this.createStopButton(),

            m("div", {
                class: "live-watch-parent-panel",
                style: `height: calc(100% - ${ Util.getHeaderHeight() }px);`
            }, [
                //左側パネル
                m("div", {
                    class: "live-watch-left-panel",
                    style: this.liveWatchViewModel.liveIsEnable() ? "" : " width: 100%;"
                }, this.createLeftContent()),
                //右側パネル
                m("div", {
                    class: "fadeIn live-watch-right-panel",
                    oncreate: (vnode: Mithril.VnodeDOM<any, any>) => { this.addShowAnimetion(vnode.dom); },
                    onupdate: (vnode: Mithril.VnodeDOM<any, any>) => { this.addShowAnimetion(vnode.dom); }
                }, this.createRightContent()),
                m("div", { style: "clear: both;" })
            ]),

            m(this.getDialogComponent(LiveProgramCardViewModel.dialogId), {
                id: LiveProgramCardViewModel.dialogId,
                width: 650,
                content: m(this.liveProgramDialogContentComponent)
            }),

            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //左側コンテンツ生成
    private createLeftContent(): Mithril.Vnode<any, any> {
        return m("div", {
            style: `height: 100%; overflow-y: auto;`,
            class: "fadeIn",
            oncreate: (vnode: Mithril.VnodeDOM<any, any>) => { this.addShowAnimetion(vnode.dom); },
            onupdate: (vnode: Mithril.VnodeDOM<any, any>) => { this.addShowAnimetion(vnode.dom); }
        }, [
            //video
            m(this.liveWatchVideoComponent),

            //番組情報
            m(this.liveWatchStreamInfoComponent),

            m("div", { style: "margin-top: 14px;" }),

            //他のストリーム
            m(this.liveWatchOtherStreamInfoComponent)
        ]);
    }

    //右側コンテンツ生成
    private createRightContent(): Mithril.Vnode<any, any> {
        //live 配信が無効の場合は表示しない
        if(!this.liveWatchViewModel.liveIsEnable()) { return m("div"); }

        return m("div", { style: `height: 100%;` }, [
            //切り替えタブ
            m("div", { id: "live_program_tab", class: "mdl-tabs" }, [
                 m("div", {
                    class: "mdl-tabs__tab-bar",
                    oncreate: () => { Util.upgradeMdl(); },
                    onupdate: () => { Util.upgradeMdl(); }
                }, this.createTab() )
            ]),

            //放送中番組の一覧
            m("div", { style: `height: calc(100% - 49px);` }, [
                m(this.liveProgramCardComponent, { single: true })
            ])
        ]);
    }

    //配信停止ボタン
    private createStopButton(): Mithril.Vnode<any, any> {
        return m("button",{
            class: "fab-right-bottom mdl-shadow--8dp mdl-button mdl-js-button mdl-button--fab mdl-button--colored",
            onclick: () => {
                let streamNum = this.getStreamId();
                if(streamNum == null) { return; }
                this.liveWatchViewModel.stopStream(streamNum);
            }
        }, [
            m("i", { class: "material-icons" }, "stop")
        ]);
    }

    private getStreamId(): number | null {
        let streamId = m.route.param("stream");

        return (typeof streamId == "undefined") ? null : Number(streamId);
    }

    private createTab(): Mithril.Vnode<any, any>[] {
        let activeHash = {
            GR: { className: "mdl-tabs__tab", style: "display: none" },
            BS: { className: "mdl-tabs__tab", style: "display: none" },
            CS: { className: "mdl-tabs__tab", style: "display: none" },
            EX: { className: "mdl-tabs__tab", style: "display: none" }
        };

        this.liveWatchViewModel.getBroadCastList().map((type, index) => {
            if(index == 0) {
                activeHash[type]["className"] += ` ${ LiveWatchView.tabIsActive }`;
                if(!this.liveWatchViewModel.getTabStatus()) {
                    this.liveWatchViewModel.setTabStatus(true);
                    //なぜか navigation open button が消えるので setTimeout で括る
                    setTimeout(() => { this.liveProgramCardViewModel.setup(type); }, 0);
                }
            }
            activeHash[type]["style"] = "display: block;"
        });

        return [
            this.createTabContent("GR", activeHash),
            this.createTabContent("BS", activeHash),
            this.createTabContent("CS", activeHash),
            this.createTabContent("EX", activeHash),
        ];
    }

    /**
    * tab の要素を生成する
    * type 放送波
    * activeHash activeHash
    */
    private createTabContent(type: string, activeHash: { [key: string]: any }): Mithril.Vnode<any, any> {
        return m("a", {
            id: this.createTabId(type),
            class: activeHash[type]["className"],
            style: activeHash[type]["style"],
            onclick:() => {
                this.tabClick(type);

                //tab click 時に番組リストを先頭に
                let element = document.getElementById(LiveProgramCardViewModel.cardParentId);
                if(element == null) { return; }

                //scroll top
                element.style.overflow = "hidden"; //iOS で scroll 停止
                setTimeout(() => {
                    element!.style.overflow = "";
                    Scroll.scrollTo(element!, element!.scrollTop, 0);
                }, 10);
            }
        }, type)
    }

    /**
    * tab クリック時に番組一覧を更新する
    * @param type 放送波
    */
    private tabClick(type: string): void {
        //クリックされたタブを active にする
        let oldElements = document.getElementsByClassName("mdl-tabs__tab " + LiveWatchView.tabIsActive);
        let newElement = document.getElementById(this.createTabId(type));

        if(newElement != null && oldElements[0] != null) {
            oldElements[0].classList.remove(LiveWatchView.tabIsActive);
            newElement.classList.add(LiveWatchView.tabIsActive);
        }

        //タブの中身を更新
        this.liveProgramCardViewModel.setup(type);
    }

    /**
    * tab id を生成
    * @param type GR, BS, CS, EX を取る
    */
    private createTabId(type: string): string {
        return `${ type }_tab`;
    }
}

namespace LiveWatchView {
    export const tabIsActive = "is-active";
}

export default LiveWatchView;


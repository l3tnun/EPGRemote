"use strict";

import * as m from 'mithril';
import ParentPageView from '../ParentPageView';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import DialogComponent from '../../Component/Dialog/DialogComponent';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';
import ProgramStationComponent from '../../Component/Program/ProgramStationComponent';
import ProgramTimeComponent from '../../Component/Program/ProgramTimeComponent';
import ProgramContentComponent from '../../Component/Program/ProgramContentComponent';
import ProgramTimeDialogComponent from '../../Component/Program/ProgramTimeDialogComponent'
import ProgramInfoDialogComponent from '../../Component/Program/ProgramInfoDialogComponent';
import ProgramInfoDialogViewModel from '../../ViewModel/Program/ProgramInfoDialogViewModel';
import LiveProgramDialogContentComponent from '../../Component/Live/LiveProgramDialogContentComponent';
import LiveProgramCardViewModel from '../../ViewModel/Live/LiveProgramCardViewModel';
import ProgramGenreDialogComponent from '../../Component/Program/ProgramGenreDialogComponent';
import ProgramGenreDialogActionComponent from '../../Component/Program/ProgramGenreDialogActionComponent';
import ProgramStorageViewModel from '../../ViewModel/Program/ProgramStorageViewModel';

/**
* Program の View
*/
class ProgramView extends ParentPageView {
    private viewModel: ProgramViewModel;
    private dialog: DialogViewModel;
    private programStorageViewModel: ProgramStorageViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.programStorageViewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");

        let headerStyle = Util.uaIsAndroid() ? "overflow: visible;" : "overflow: hidden;";

        return m("div", [
            //header メニュー
            //ダイアログの後に置くと /log から移動してきたときに開けなくなる
            this.createHeaderMenu([
                m("li", {
                    class: "mdl-menu__item",
                    onclick: () => {
                        //open genre dialog
                        this.programStorageViewModel.init();
                        this.dialog.open(ProgramStorageViewModel.genreDialogId);
                    }
                }, "表示ジャンル設定"),
            ]),

            m("div", {
                class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
                style: "display: block; " + headerStyle
            }, [
                //header
                this.createHeader(this.createTitleStr(), [
                    //時刻アイコン
                    m("label", {
                        class: "header_menu_button",
                        onclick: () => { this.dialog.open(ProgramViewModel.timeDialogId); }
                    }, m("i", { class: "material-icons" }, "schedule")),
                ]),

                this.createNavigation(),

                m("div", {
                    class: "fadeIn",
                    config: (element, isInit) => {
                        this.addShowAnimetion(element, isInit);
                    }
                }, [
                    //局名
                    m.component(new ProgramStationComponent()),

                    //時刻
                    m.component(new ProgramTimeComponent()),
                ]),

                //program
                m("div", {
                    id: ProgramViewModel.programFrameId,
                    style: this.createFrameStyle(),
                    config: (element, isInit, context) => { this.frameConfig(element, isInit, context); }
                }, [
                    //時刻線
                    m("div", { id: "tableNowBar", style: this.createNowBarStyle() }, "now" ),
                    m.component(new ProgramContentComponent())
                ]),

                //プログレスバー
                m("div", {
                    class: "program_busy",
                    style:  this.viewModel.getProgressStatus() ? "display: block;" : "display: none;"
                }, [
                    m("div", {
                        class: "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active",
                        style: "position: absolute; top: 50%; left: 50%;"
                    })
                ]),
            ]),

            //時刻ダイアログ
            m.component(new DialogComponent(), {
                id: ProgramViewModel.timeDialogId,
                width: 820,
                content: m.component(new ProgramTimeDialogComponent())
            }),

            //予約ダイアログ
            m.component(new DialogComponent(), {
                id: ProgramInfoDialogViewModel.infoDialogId,
                width: 400,
                content: m.component(new ProgramInfoDialogComponent())
            }),

            //ライブ配信ダイアログ
            m.component(new DialogComponent(), {
                id: LiveProgramCardViewModel.dialogId,
                width: 650,
                content: m.component(new LiveProgramDialogContentComponent())
            }),

            //表示ジャンルダイアログ
            m.component(new DialogComponent(), {
                id: ProgramStorageViewModel.genreDialogId,
                width: 400,
                scrollOffset: 100,
                content: m.component(new ProgramGenreDialogComponent()),
                action: m.component(new ProgramGenreDialogActionComponent())
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //header title を生成する
    private createTitleStr(): string {
        let titleStr = "番組表";
        let starttime = this.viewModel.getTime()["startTime"];

        if(typeof starttime == "undefined") { return titleStr; }

        if(typeof m.route.param("type") != "undefined") {
            titleStr += m.route.param("type") + DateUtil.format(DateUtil.getJaDate(new Date(starttime)), " MM/dd(w)");
        } else if(typeof m.route.param("ch") != "undefined") {
            let channels = this.viewModel.getChannel();
            titleStr = channels.length == 0 ? "" : channels[0]["name"];
        }

        return titleStr;
    }

    private createFrameStyle(): string {
        let viewConfig = this.viewModel.getViewConfig();
        let stationHeight = viewConfig["stationHeight"];
        let timeWidth = viewConfig["timeWidth"];

        return `height: calc(100% - ${ Util.getHeaderHeight() + stationHeight }px);`
            + `width: calc(100% - ${ timeWidth }px);`
            + `margin-left: ${ timeWidth }px;`
            + `overflow: scroll;`;
    }

    private frameConfig(element: Element, isInit: boolean, context: Mithril.Context): void {
        let qyeryStr = JSON.stringify(Util.getCopyQuery());

        if(!isInit) {
            //スクロール処理
            let stationFrame =  document.getElementById(ProgramViewModel.stationFrameId)!;
            let timeFrame = document.getElementById(ProgramViewModel.timeFrameId)!;
            (<HTMLElement>element).onscroll = () => {
                stationFrame.scrollLeft = element.scrollLeft;
                timeFrame.scrollTop = element.scrollTop;
            }

            context["query"] = null;
        } else if(context["query"] == null || context["query"] != qyeryStr) {
            //init scroll position
            context["query"] = qyeryStr;
            (<HTMLElement>element).scrollLeft = 0;
            (<HTMLElement>element).scrollTop = 0;
        }
    }

    private createNowBarStyle(): string {
        let titles = document.getElementsByClassName("station_title");
        if(typeof titles[2] == "undefined") { return "top: -100px;"; }

        return `width: ${ (titles.length - 2) * this.viewModel.getViewConfig()["stationWidth"] }px;`
            + `top: ${ this.getNowBarPosition() }px;`
    }

    private getNowBarPosition(): number {
        if(Util.hashSize(this.viewModel.getTime()) == 0) { return -100; }

        let now = new Date().getTime();
        let start = new Date(this.viewModel.getTime()["startTime"]).getTime();
        let end = new Date(this.viewModel.getTime()["endTime"]).getTime();
        let timeHeight = this.viewModel.getViewConfig()["timeHeight"];

        let position = Math.floor((now - start) / 1000 / 60) * Math.floor(timeHeight / 60);

        return (position <= -1 || now > end) ? -100 : position;
    }
}

export default ProgramView;


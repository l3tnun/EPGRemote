"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import ParentPageView from '../ParentPageView';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
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

    private programStationComponent = new ProgramStationComponent();
    private programTimeComponent = new ProgramTimeComponent();
    private programContentComponent = new ProgramContentComponent();
    private programTimeDialogComponent = new ProgramTimeDialogComponent();
    private programInfoDialogComponent = new ProgramInfoDialogComponent();
    private liveProgramDialogContentComponent = new LiveProgramDialogContentComponent();
    private programGenreDialogComponent = new ProgramGenreDialogComponent();
    private programGenreDialogActionComponent = new ProgramGenreDialogActionComponent();

    public execute(): Vnode<any, any> {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.programStorageViewModel = <ProgramStorageViewModel>this.getModel("ProgramStorageViewModel");

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
                style: "display: block; overflow: hidden;"
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

                //局名
                m(this.programStationComponent),

                //時刻
                m(this.programTimeComponent),

                //program
                m("div", {
                    id: ProgramViewModel.programFrameId,
                    style: this.createFrameStyle(),
                    oncreate: (vnode: VnodeDOM<any, any>) => { this.frameInit(vnode.dom, vnode.state); }
                }, [
                    //時刻線
                    m("div", { id: "tableNowBar", style: this.createNowBarStyle() }, "now" ),
                    m(this.programContentComponent)
                ]),

                //プログレスバー
                m("div", {
                    id: ProgramViewModel.programBusyId,
                    style:  "display: block;"
                }, [
                    m("div", {
                        class: "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active",
                        style: "position: absolute; top: 50%; left: 50%;"
                    })
                ]),
            ]),

            //時刻ダイアログ
            m(this.getDialogComponent(ProgramViewModel.timeDialogId), {
                id: ProgramViewModel.timeDialogId,
                width: 820,
                content: m(this.programTimeDialogComponent)
            }),

            //予約ダイアログ
            m(this.getDialogComponent(ProgramInfoDialogViewModel.infoDialogId), {
                id: ProgramInfoDialogViewModel.infoDialogId,
                width: 400,
                content: m(this.programInfoDialogComponent)
            }),

            //ライブ配信ダイアログ
            m(this.getDialogComponent(LiveProgramCardViewModel.dialogId), {
                id: LiveProgramCardViewModel.dialogId,
                width: 650,
                content: m(this.liveProgramDialogContentComponent)
            }),

            //表示ジャンルダイアログ
            m(this.getDialogComponent(ProgramStorageViewModel.genreDialogId), {
                id: ProgramStorageViewModel.genreDialogId,
                width: 400,
                scrollOffset: 100,
                content: m(this.programGenreDialogComponent),
                action: m(this.programGenreDialogActionComponent)
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
        if(this.viewModel.getTime() == null) { return titleStr; }
        let starttime = this.viewModel.getTime()!["startTime"];

        if(typeof m.route.param("type") != "undefined") {
            titleStr += m.route.param("type") + DateUtil.format(DateUtil.getJaDate(new Date(starttime)), " MM/dd(w)");
        } else if(typeof m.route.param("ch") != "undefined") {
            let channels = this.viewModel.getChannel();
            titleStr = channels == null || channels.length == 0 ? "" : channels[0]["name"];
        }

        return titleStr;
    }

    private createFrameStyle(): string {
        let viewConfig = this.viewModel.getViewConfig();

        let stationHeight = viewConfig == null ? 0 : viewConfig["stationHeight"];
        let timeWidth = viewConfig == null ? 0 : viewConfig["timeWidth"];

        return `height: calc(100% - ${ Util.getHeaderHeight() + stationHeight }px);`
            + `width: calc(100% - ${ timeWidth }px);`
            + `margin-left: ${ timeWidth }px;`
            + `overflow: scroll;`;
    }

    private frameInit(element: Element, context: { [key: string]: any }): void {
        context["query"] = null;

        //スクロール処理
        (<HTMLElement>element).onscroll = () => {
            let stationFrame =  document.getElementById(ProgramViewModel.stationFrameId)!;
            let timeFrame = document.getElementById(ProgramViewModel.timeFrameId)!;
            stationFrame.scrollLeft = element.scrollLeft;
            timeFrame.scrollTop = element.scrollTop;
        }
    }

    private createNowBarStyle(): string {
        if(this.viewModel.stationCnt == 0) { return "top: -100px;"; }

        let viewConfig = this.viewModel.getViewConfig();
        let stationWidth = 0;
        if(viewConfig != null) { stationWidth = viewConfig["stationWidth"]; }

        return `width: ${ this.viewModel.stationCnt * stationWidth }px;`
            + `top: ${ this.getNowBarPosition() }px;`
    }

    private getNowBarPosition(): number {
        let viewConfig = this.viewModel.getViewConfig();
        let time = this.viewModel.getTime();
        if(time == null || Util.hashSize(time) == 0) { return -100; }

        let timeHeight = 0;
        if(viewConfig != null) { timeHeight = viewConfig["timeHeight"]; }

        let now = new Date().getTime();
        let start = new Date(time["startTime"]).getTime();
        let end = new Date(time["endTime"]).getTime();

        let position = Math.floor((now - start) / 1000 / 60) * Math.floor(timeHeight / 60);

        return (position <= -1 || now > end) ? -100 : position;
    }
}

export default ProgramView;


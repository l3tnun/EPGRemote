"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import ParentPageView from '../ParentPageView';
import DateUtil from '../../Util/DateUtil';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import RecordedViewModel from '../../ViewModel/Recorded/RecordedViewModel';
import PaginationComponent from '../../Component/Pagination/PaginationComponent';
import PaginationViewModel from '../../ViewModel/Pagination/PaginationViewModel';
import MenuComponent from '../../Component/Menu/MenuComponent';
import MenuViewModel from '../../ViewModel/Menu/MenuViewModel';
import RecordedMenuContentComponent from '../../Component/Recorded/RecordedMenuContentComponent';
import RecordedMenuViewModel from '../../ViewModel/Recorded/RecordedMenuViewModel';
import RecordedProgramInfoDialogComponent from '../../Component/Recorded/RecordedProgramInfoDialogComponent';
import RecordedDeleteVideoDialogComponent from '../../Component/Recorded/RecordedDeleteVideoDialogComponent';
import RecordedVideoLinkDialogComponent from '../../Component/Recorded/RecordedVideoLinkDialogComponent';
import RecordedVideoLinkDialogViewModel from '../../ViewModel/Recorded/RecordedVideoLinkDialogViewModel';
import RecordedSearchMenuComponent from '../../Component/Recorded/RecordedSearchMenuComponent';
import RecordedSearchMenuViewModel from '../../ViewModel/Recorded/RecordedSearchMenuViewModel';

/**
* Recorded の View
* ページ読み込み時に Navigation を開く
*/
class RecordedView extends ParentPageView {
    private dialog: DialogViewModel;
    private paginationViewModel: PaginationViewModel;
    private viewModel: RecordedViewModel;
    private menuViewModel: MenuViewModel;
    private recordedMenuViewModel: RecordedMenuViewModel;
    private recordedVideoLinkViewModel: RecordedVideoLinkDialogViewModel;
    private recordedSearchMenuViewModel: RecordedSearchMenuViewModel;
    private resizeListener = this.resize.bind(this);

    private paginationComponent = new PaginationComponent();
    private menuComponent = new MenuComponent();
    private recordedMenuContentComponent = new RecordedMenuContentComponent();
    private recordedProgramInfoDialogComponent = new RecordedProgramInfoDialogComponent();
    private recordedDeleteVideoDialogComponent = new RecordedDeleteVideoDialogComponent();
    private recordedVideoLinkDialogComponent = new RecordedVideoLinkDialogComponent();
    private recordedSearchMenuComponent = new RecordedSearchMenuComponent();

    public execute(): Vnode<any, any> {
        this.viewModel = <RecordedViewModel>this.getModel("RecordedViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");
        this.paginationViewModel = <PaginationViewModel>this.getModel("PaginationViewModel");
        this.menuViewModel = <MenuViewModel>this.getModel("MenuViewModel");
        this.recordedMenuViewModel = <RecordedMenuViewModel>this.getModel("RecordedMenuViewModel");
        this.recordedVideoLinkViewModel = <RecordedVideoLinkDialogViewModel>this.getModel("RecordedVideoLinkDialogViewModel");
        this.recordedSearchMenuViewModel = <RecordedSearchMenuViewModel>this.getModel("RecordedSearchMenuViewModel");

        //Pagintion setup
        this.paginationViewModel.setup(this.viewModel.getRecordedLimit(), this.viewModel.getRecordedTotalNum());

        return m("div", { class: "mdl-layout mdl-js-layout mdl-layout--fixed-header" }, [
            this.createHeader("録画済み一覧", [
                //search menu button
                m("label", {
                    class: "header_menu_button",
                    onclick: () => {
                        this.menuViewModel.close();
                        this.recordedSearchMenuViewModel.changeShowStatus();
                    }
                }, m("i", { class: "material-icons" }, "search")),
            ]),
            this.createHeaderMenu(),
            this.createNavigation(),

            this.mainLayout([
                m(this.recordedSearchMenuComponent),

                this.mainView(),
                //program menu
                m(this.menuComponent, {
                    id: RecordedMenuViewModel.id,
                    content: m(this.recordedMenuContentComponent)
                }),
                m("div", { style: "height: 20px;" }) //dummy
            ]),

            //video link dialog
            m(this.getDialogComponent("RecordedVideoLinkDialogViewModel.dialogId"), {
                id: RecordedVideoLinkDialogViewModel.dialogId,
                width: 300,
                content: m(this.recordedVideoLinkDialogComponent)
            }),

            //delete video dialog
            m(this.getDialogComponent(RecordedMenuViewModel.deleteVideoDialogId), {
                id: RecordedMenuViewModel.deleteVideoDialogId,
                width: 300,
                content: m(this.recordedDeleteVideoDialogComponent)
            }),

            //program info dialog
            m(this.getDialogComponent(RecordedMenuViewModel.programInfoDialogId), {
                id: RecordedMenuViewModel.programInfoDialogId,
                width: 300,
                scrollOffset: 120,
                content: m(this.recordedProgramInfoDialogComponent)
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //main view
    private mainView(): Vnode<any, any> {
        return m("div", {
            id: RecordedView.mainViewId,
            oncreate: () => {
                window.addEventListener("resize", this.resizeListener, false);
            },
            onupdate: () => { this.resize(0); },
            onremove: () => {
                window.removeEventListener("resize", this.resizeListener, false );
            }
        },[
            this.createCardListView(),
            m(this.paginationComponent)
        ]);
    }

    private resize(wait: number = 100): void {
        setTimeout(() => {
            let element = <HTMLElement>document.getElementById(RecordedView.mainViewId);
            if(element == null) { return; }

            if(window.innerWidth <= RecordedView.gridChangeWidth) { element.style.width = ""; return; }

            let width = Math.floor(window.innerWidth / RecordedView.gridCardWidth) * RecordedView.gridCardWidth || RecordedView.gridCardWidth;

            element.style.width = width + "px";
        }, wait);
    }

    //カードリスト表示
    private createCardListView(): Vnode<any, any>[] {
        return this.viewModel.getRecordedList().map((program: { [key: string]: any }) => {
            return this.createCardListContent(program);
        });
    }

    //カードリストの中身
    private createCardListContent(program: { [key: string]: any }): Vnode<any, any> {
        return m("div", { class: "recorded-list-program mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col" }, [
            m("button", { class: "recorded-list-menu mdl-button mdl-js-button mdl-button--icon",
                onclick: (e: Event) => { this.openMenu(program, <Element>(e.target)); }
            }, [
                m("i", { class: "material-icons" }, "more_vert" )
            ]),
            m("div", { onclick: () => { this.openVideoLinkDialog(program); } }, [
                m("div", { class: "recorded-list-picture-container" }, [
                    m("img", { class: "recorded-list-picture", src: program["thumbs"] } ),
                ]),
                m("div", { class: "recorded-list-text-container" }, [
                    m("div", { class: "recorded-program-title recorded-program-title-card" }, program["title"]),
                    m("div", { class: "recorded-program-info" }, `${ program["channel_name"] }` ),
                    m("div", { class: "recorded-program-info" }, this.getTimeStr(program["starttime"], program["endtime"])),
                    m("div", { class: "recorded-program-description" }, program["description"])
                ])
            ])
        ]);
    }

    //時刻文字列
    private getTimeStr(startTimeStr: string, endTimeStr: string): string {
        let start = DateUtil.getJaDate(new Date(startTimeStr));
        let end = DateUtil.getJaDate(new Date(endTimeStr));

        return `${ DateUtil.format(start, "MM/dd(w) hh:mm") } ~ ${ DateUtil.format(end, "hh:mm") }(${ Math.floor(DateUtil.dateDiff(end, start) / 1000 / 60) }分)`;
    }

    //番組カードのメニューを開く
    private openMenu(program: { [key: string]: any }, target: Element): void {
        this.recordedMenuViewModel.program = program;
        this.menuViewModel.open(RecordedMenuViewModel.id, target);
    }

    //動画リンクダイアログを開く
    private openVideoLinkDialog(program: { [key: string]: any }): void {
        this.recordedVideoLinkViewModel.update(program["id"]);
        this.dialog.open(RecordedVideoLinkDialogViewModel.dialogId);
    }
}

namespace RecordedView {
    export const mainViewId = "recorded-list-box";
    export const gridCardWidth = 308;
    export const gridChangeWidth = 616;
}

export default RecordedView;


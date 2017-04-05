"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import ParentPageView from '../ParentPageView';
import DateUtil from '../../Util/DateUtil';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ReservationViewModel from '../../ViewModel/Reservation/ReservationViewModel';
import PaginationComponent from '../../Component/Pagination/PaginationComponent';
import PaginationViewModel from '../../ViewModel/Pagination/PaginationViewModel';
import ReservationDeleteDialogContentComponent from '../../Component/Reservation/ReservationDeleteDialogContentComponent';
import ReservationDeleteDialogContentViewModel from '../../ViewModel/Reservation/ReservationDeleteDialogContentViewModel';
import MenuComponent from '../../Component/Menu/MenuComponent';
import MenuViewModel from '../../ViewModel/Menu/MenuViewModel';
import ReservationMenuContentComponent from '../../Component/Reservation/ReservationMenuContentComponent';
import ReservationMenuViewModel from '../../ViewModel/Reservation/ReservationMenuViewModel';

/**
* Reservation の View
* ページ読み込み時に Navigation を開く
*/
class ReservationView extends ParentPageView {
    private dialogViewModel: DialogViewModel;
    private paginationViewModel: PaginationViewModel;
    private viewModel: ReservationViewModel;
    private deleteDialogContent: ReservationDeleteDialogContentViewModel;
    private menuViewModel: MenuViewModel;
    private menuContentViewModel: ReservationMenuViewModel;

    private paginationComponent = new PaginationComponent();
    private reservationDeleteDialogContentComponent = new ReservationDeleteDialogContentComponent();
    private menuComponent = new MenuComponent();
    private reservationMenuContentComponent = new ReservationMenuContentComponent();

    public execute(): Vnode<any, any> {
        this.viewModel = <ReservationViewModel>this.getModel("ReservationViewModel");
        this.dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");
        this.paginationViewModel = <PaginationViewModel>this.getModel("PaginationViewModel");
        this.deleteDialogContent = <ReservationDeleteDialogContentViewModel>this.getModel("ReservationDeleteDialogContentViewModel");
        this.menuViewModel = <MenuViewModel>this.getModel("MenuViewModel");
        this.menuContentViewModel = <ReservationMenuViewModel>this.getModel("ReservationMenuViewModel");

        //Pagintion setup
        this.paginationViewModel.setup(this.viewModel.getProgramLimit(), this.viewModel.getProgramTotalNum());

        return m("div", {
            class: "mdl-layout mdl-js-layout mdl-layout--fixed-header",
            oncreate: () => { this.viewModel.resize(); },
            onupdate: () => { this.viewModel.resize(); }
        }, [
            this.createHeader("録画予約一覧"),
            this.createHeaderMenu(),
            this.createNavigation(),

            this.mainLayout([
                this.mainView(),
                m(this.paginationComponent, {
                    maxWidth: 840
                }),
                m("div", { style: "height: 20px;" }) //dummy
            ]),

            //delete dialog
            m(this.getDialogComponent(ReservationDeleteDialogContentViewModel.dialogId), {
                id: ReservationDeleteDialogContentViewModel.dialogId,
                width: 300,
                content: m(this.reservationDeleteDialogContentComponent)
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }

    //カード表示、表表示を切り替える
    private mainView(): Vnode<any, any> | (Vnode<any, any> | Vnode<any, any>[])[] {
        if(this.viewModel.getShowStatus() == null) { return m("div"); }

        //カード表示
        if(this.viewModel.getShowStatus()) {
            return [
                this.createCardView(),
                //menu
                m(this.menuComponent, {
                    id: ReservationMenuViewModel.id,
                    content: m(this.reservationMenuContentComponent)
                })
            ];
        } else { //表表示
            return this.createTableView();
        }
    }

    //カード表示
    private createCardView(): Vnode<any, any>[] {
        return this.viewModel.getPrograms().map((program: { [key: string]: any }) => {
            return m("div", { class: "reservation-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col" }, [
                m("button", {
                    class: "mdl-button mdl-js-button mdl-button--icon",
                    style: "position: absolute; right: 0px;",
                    onclick: (e: Event) => { //menu open
                        this.menuContentViewModel.program = program;
                        this.menuViewModel.open(ReservationMenuViewModel.id, <Element>(e.target));
                    }
                }, [
                    m("i", { class: "material-icons" }, "more_vert" ) //menu icon
                ]),

                //番組情報
                m("div", { class: "mdl-card__supporting-text" }, [
                    m("div", { class: "reservation-card-title" }, program["title"]),
                    m("div", { class: "reservation-card-time" }, this.getCardRecTime(program["starttime"], program["endtime"]), this.getRecDiffTime(program["endtime"], program["starttime"])),
                    m("div", { class: "reservation-card-channel-name" }, program["channel_name"]),
                    m("div", { class: "reservation-card-description" }, program["description"])
                ])
            ])
        });
    }

    private getCardRecTime(startStr: string, endStr: string): string {
        let start = DateUtil.getJaDate(new Date(startStr));
        let end = DateUtil.getJaDate(new Date(endStr));

        return `${ DateUtil.format(start, "MM/dd(w) hh:mm") } ~ ${ DateUtil.format(end, "hh:mm") }`;
    }

    private getRecDiffTime(end: string, start: string): string {
        let diff = Math.floor(DateUtil.dateDiff(new Date(end), new Date(start)) / 1000 / 60);
        return `(${ diff }分)`;
    }

    //表表示
    private createTableView(): Vnode<any, any> {
        let programs = this.viewModel.getPrograms();
        if(programs.length == 0) { return m("div"); }

        return m("table", { class: "reservation-list mdl-data-table mdl-js-data-table mdl-shadow--2dp" }, [
            m("thead", [
                m("tr", [
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "放送局"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "日付"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "録画時間"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "録画"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "タイトル"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "内容"),
                    m("th", { class: "reservation-list-title-th mdl-data-table__cell--non-numeric" }, "編集"),
                ])
            ]),

            //content
            m("tbody", [
                programs.map((program: { [key: string]: any }) => {
                    return this.createTableContent(program);
                })
            ])
        ]);
    }

    private createTableContent(program: { [key: string]: any }): Vnode<any, any> {
        return m("tr", [
            m("th", { class: "reservation-list-th reservation-list-channel-name mdl-data-table__cell--non-numeric" }, program["channel_name"]),
            m("th", { class: "reservation-list-th reservation-list-date mdl-data-table__cell--non-numeric" }, `${ this.getTableDateStr(program["starttime"]) }`),
            m("th", { class: "reservation-list-th reservation-list-time mdl-data-table__cell--non-numeric" }, [
                `${ this.getTableRectime(program["starttime"], program["endtime"]) }`,
                m("div", { class: "reservation-list-rec-time" }, this.getRecDiffTime(program["endtime"], program["starttime"]))
            ]),
            m("th", { class: "reservation-list-th reservation-list-rec-mode mdl-data-table__cell--non-numeric" }, program["mode"]),
            m("th", { class: "reservation-list-th reservation-list-title mdl-data-table__cell--non-numeric" }, program["title"]),
            m("th", { class: "reservation-list-th reservation-list-description mdl-data-table__cell--non-numeric" }, program["description"]),
            m("th", { class: "reservation-list-th reservation-list-button-content mdl-data-table__cell--non-numeric", style: "padding-right: 8px;" }, [
                m("button", { class: "mdl-button mdl-js-button mdl-button--primary", style: (program["autorec"] == 0) ? "display: none;" : "",
                    onclick: () => { m.route.set("/search", { keyword_id: program["autorec"] }); }
                },"編集"),
                m("div"),
                m("button", { class: "mdl-button mdl-js-button mdl-button--primary",
                    onclick: () => {
                        //delete dialog
                        this.deleteDialogContent.setup(program);
                        this.dialogViewModel.open(ReservationDeleteDialogContentViewModel.dialogId);
                        //menu close
                        this.menuViewModel.close();
                    }
                },"削除")
            ])
        ]);
    }

    private getTableDateStr(timeStr: string): string {
        let date = DateUtil.getJaDate(new Date(timeStr));

        return DateUtil.format(date, "MM/dd(w)");
    }

    private getTableRectime(startStr: string, endStr: string): string {
        let start = DateUtil.getJaDate(new Date(startStr));
        let end = DateUtil.getJaDate(new Date(endStr));

        return `${ DateUtil.format(start, "hh:mm") } ~ ${ DateUtil.format(end, "hh:mm") }`;
    }
}

export default ReservationView;


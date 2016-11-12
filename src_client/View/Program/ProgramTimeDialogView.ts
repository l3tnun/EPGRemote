"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramTimeDialog の View
*/

class ProgramTimeDialogView extends View {
    private viewModel: ProgramViewModel;
    private dialog: DialogViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        if(typeof this.viewModel.getTime()["startTime"] == "undefined") { return m("div", ""); }

        return m("div", { class: "program-time-dialog-content" }, [
            m("div", "時間"),
            m("div", { class: "program-time-dialog-time-frame" }, [
                this.createTime()
            ]),

            m("div", "日付"),
            m("div", { class: "program-time-dialog-day-frame" }, [
                this.createDay()
            ])
        ]);
    }

    //時刻
    private createTime(): Mithril.VirtualElement[] {
        let result: Mithril.VirtualElement[] = [];
        for(var i = 0; i < 23; i += 2) { result.push(this.createTimeContent(i)); }

        return result;
    }

    private createTimeContent(i: number): Mithril.VirtualElement {
        let query = Util.getCopyQuery();
        let text = Util.strZeroPlus(i, 2);

        if(typeof query["time"] == "undefined") {
            query["time"] = DateUtil.format(DateUtil.getJaDate(new Date()), "yyyyMMdd") + Util.strZeroPlus(i, 2);
        } else {
            query["time"] = query["time"].substr(0,8) + Util.strZeroPlus(i, 2);
        }

        if(query["time"] == Util.getCopyQuery()["time"]) { return this.createNowElement(text); }

        return this.createElement(text, <{ [key: string]: string; }>query);
    }

    //日付
    private createDay(): Mithril.VirtualElement[] {
        let result: Mithril.VirtualElement[] = [];

        result.push(this.createDayContent("現在"));

        let now = new Date();
        let hour = typeof m.route.param("time") == "undefined" ? now.getHours() : Number(m.route.param("time").substr(8, 2));
        let stattime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour);

        for(var i = 0; i < 8; i++) {
            let name = DateUtil.format(stattime, "dd(w)");
            let timeQuery = DateUtil.format(stattime, "yyyyMMddhh");
            result.push(this.createDayContent(name, timeQuery));
            stattime = new Date(stattime.getTime() + 1000 * 60 * 60 * 24);
        }

        return result;
    }

    private createDayContent(name: string, timeQuery: string | null = null): Mithril.VirtualElement {
        let query = Util.getCopyQuery();

        if(query["time"] == timeQuery) { return this.createNowElement(name); }

        if(timeQuery == null) { delete query["time"]; }
        else { query["time"] = timeQuery; }

        return this.createElement(name, <{ [key: string]: string; }>query);
    }

    private createNowElement(name: string): Mithril.VirtualElement {
        return m("a", {
            class: "program-time-dialog-time",
            onclick: () => { this.dialog.close(); }
        }, name);
    }

    private createElement(name: string, query: { [key: string]: string }): Mithril.VirtualElement {
        return m("a", {
            class: "program-time-dialog-time",
            href:  m.route().split("?")[0] + "?" + m.route.buildQueryString(query),
            config: m.route,
            onclick: () => { this.dialog.close(); }
        }, name);
    }
}

export default ProgramTimeDialogView


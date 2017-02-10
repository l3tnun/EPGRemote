"use strict";

import * as m from 'mithril';
import View from '../View';
import DateUtil from '../../Util/DateUtil';
import RecordedMenuViewModel from '../../ViewModel/Recorded/RecordedMenuViewModel';

class RecordedProgramInfoDialogView extends View {
    public execute(): Mithril.Vnode<any, any> {
        let program = (<RecordedMenuViewModel>this.getModel("RecordedMenuViewModel")).program;
        if(program == null) { return m("div", "empty"); }

        return m("div", { class: "recorded_program_info_dialog_frame" }, [
            m("div", { class: "recorded_program_info_dialog_title" }, program["title"]),
            m("div", { class: "recorded_program_info_dialog_time" }, this.getTimeStr(program["starttime"], program["endtime"])),
            m("div", { class: "recorded_program_info_dialog_channel" }, program["channel_name"]),
            m("img", { class: "recorded_program_info_dialog_picture", src: program["thumbs"] }),
            m("div", { class: "recorded_program_info_dialog_description" }, program["description"])
        ]);
    }

    //時刻文字列
    private getTimeStr(startTimeStr: string, endTimeStr: string): string {
        let start = DateUtil.getJaDate(new Date(startTimeStr));
        let end = DateUtil.getJaDate(new Date(endTimeStr));

        return `${ DateUtil.format(start, "MM/dd(w) hh:mm") } ~ ${ DateUtil.format(end, "hh:mm") }(${ Math.floor(DateUtil.dateDiff(end, start) / 1000 / 60) }分)`;
    }
}

export default RecordedProgramInfoDialogView;


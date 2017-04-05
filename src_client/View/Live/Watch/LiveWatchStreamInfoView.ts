"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../../View';
import LiveWatchStreamInfoViewModel from '../../../ViewModel/Live/Watch/LiveWatchStreamInfoViewModel';
import DateUtil from '../../../Util/DateUtil';

/**
* LiveWatchStreamInfo の View
*/
class LiveWatchStreamInfoView extends View {
    private viewModel: LiveWatchStreamInfoViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <LiveWatchStreamInfoViewModel>this.getModel("LiveWatchStreamInfoViewModel");

        let info = this.viewModel.getInfo();

        return m("div", {
            class: "live-program mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col"
        }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                m("div", { class: "live-program-description" }, "番組情報"),
                m("div", { class: "program-station-name" }, info["name"]),
                m("div", { class: "program-time" }, `${ this.getFormatedDate(info["starttime"]) } ~ ${ this.getFormatedDate(info["endtime"]) }`),
                m("div", { class: "program-title" }, info["title"]),
                m("div", { class: "program-description" }, info["description"])
            ])
        ]);
    }

    /**
    * Date を hh:mm 形式に変換する
    * @param date string型
    */
    private getFormatedDate(date: string): string {
        return DateUtil.format(DateUtil.getJaDate(new Date(date)), "hh:mm");
    }
}

export default LiveWatchStreamInfoView;


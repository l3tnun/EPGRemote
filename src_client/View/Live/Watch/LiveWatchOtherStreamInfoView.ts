"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../../View';
import LiveWatchOtherStreamInfoViewModel from '../../../ViewModel/Live/Watch/LiveWatchOtherStreamInfoViewModel';
import DateUtil from '../../../Util/DateUtil';

/**
* LiveWatchOtherStreamInfoView の View
*/
class LiveWatchOtherStreamInfoView extends View {
    private viewModel: LiveWatchOtherStreamInfoViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <LiveWatchOtherStreamInfoViewModel>this.getModel("LiveWatchOtherStreamInfoViewModel");

        let info = this.viewModel.getOtherStreamInfo();
        if(info.length == 0) { return m(""); }

        let content = this.createCard(info);
        if(content.length == 0) { return m(""); }

        return m("div", {
            class: "live-program mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col",
            onclick: () => { this.viewModel.update(); }
        }, [
            m("div", { class: "mdl-card__supporting-text" }, [
                m("div", { class: "live-program-description" }, [ "配信中" ]),
                content
            ])
        ]);
    }

    private createCard(info: any[]): Vnode<any, any>[] {
        let result: Vnode<any, any>[] = [];

        info.map((data: { [key: string]: any }) => {
            if(data["streamType"] != "live" && data["streamType"] != "recorded") { return; };
            result.push(
                m("a", { class: "card-link", href: `/live/watch?stream=${ data["streamNumber"] }`, oncreate: m.route.link }, [
                    m("div", { class: "program-station-name" }, data["name"]),
                    m("div", { class: "program-time" }, `${ this.getFormatedDate(data["starttime"]) } ~ ${ this.getFormatedDate(data["endtime"]) }`),
                    m("div", { class: "program-title" }, data["title"]),
                    m("div", { class: "program-description" }, data["description"])
                ])
            );
            result.push( m("hr", { class: ".card-line" } ) );
        });

        result.pop();
        return result;
    }

    /**
    * Date を hh:mm 形式に変換する
    * @param date string型
    */
    private getFormatedDate(date: string): string {
        return DateUtil.format(DateUtil.getJaDate(new Date(date)), "hh:mm");
    }
}

export default LiveWatchOtherStreamInfoView;


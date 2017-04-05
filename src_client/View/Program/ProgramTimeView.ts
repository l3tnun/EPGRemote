"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramTime の View
*/

class ProgramTimeView extends View {
    private viewModel: ProgramViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");

        return m("div", {
            id: ProgramViewModel.timeFrameId,
            style: this.createStyle()
        }, [
            this.create()
        ]);
    }

    private create(): Vnode<any, any>[] {
        let viewConfig = this.viewModel.getViewConfig();
        if(viewConfig == null) { return []; }

        let time = this.viewModel.getTime();
        if(time == null) { return []; }

        let start = DateUtil.getJaDate(new Date(time["startTime"])).getHours();
        let end: number;

        if(typeof m.route.param("ch") == "undefined") {
            //非単局表示
            end = ((new Date(time["endTime"]).getTime() - new Date(time["startTime"]).getTime()) / 1000 / 60 / 60 ) + start;
        } else {
            //単局表示
            end = start + 23;
        }

        let result: Vnode<any, any>[] = [];
        for(let i = start; i < end + 1; i++) {
            result.push(this.createContent(
                i % 24, viewConfig["timeWidth"], viewConfig["timeHeight"], viewConfig["timeFontSize"]
            ) )
        }
        return result;
    }

    private createStyle(): string {
        let viewConfig = this.viewModel.getViewConfig();
        let offset = viewConfig == null ? 0 : Util.getHeaderHeight() + viewConfig["stationHeight"];

        return `height: calc(100% - ${ offset }px);`
    }

    private createContent(num: number, timeWidth: number, timeHeight: number, timeFontSize: number): Vnode<any, any> {
        return m("div", { class: `time time_${ num }`,
            style: `max-width: ${ timeWidth }px;`
            + `min-width: ${ timeWidth }px;`
            + `max-height: ${ timeHeight }px;`
            + `min-height: ${ timeHeight }px;`
            + `font-size: ${ timeFontSize }px;`
        } , Util.strZeroPlus(num, 2));
    }
}

export default ProgramTimeView;

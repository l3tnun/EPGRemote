"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

/**
* ProgramTime の View
*/

class ProgramTimeView extends View {
    private viewModel: ProgramViewModel;

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");

        return m("div", {
            id: ProgramViewModel.timeFrameId,
            style: this.createStyle()
        }, [
            this.create()
        ]);
    }

    private create(): Mithril.VirtualElement[] {
        let viewConfig = this.viewModel.getViewConfig();
        let time = this.viewModel.getTime();
        let start = DateUtil.getJaDate(new Date(time["startTime"])).getHours();
        let end: number;

        if(typeof m.route.param("ch") == "undefined") {
            //非単局表示
            end = ((new Date(time["endTime"]).getTime() - new Date(time["startTime"]).getTime()) / 1000 / 60 / 60 ) + start;
        } else {
            //単局表示
            end = start + 23;
        }

        let result: Mithril.VirtualElement[] = [];
        for(let i = start; i < end + 1; i++) {
            result.push(this.createContent(
                i % 24, viewConfig["timeWidth"], viewConfig["timeHeight"], viewConfig["timeFontSize"]
            ) )
        }
        return result;
    }

    private createStyle(): string {
        let offset = Util.getHeaderHeight() + this.viewModel.getViewConfig()["stationHeight"];

        return `height: calc(100% - ${ offset }px);`
    }

    private createContent(num: number, timeWidth: number, timeHeight: number, timeFontSize: number): Mithril.VirtualElement {
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

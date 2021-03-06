"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import DateUtil from '../../Util/DateUtil';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';
import LiveProgramDialogContentViewModel from '../../ViewModel/Live/LiveProgramDialogContentViewModel';
import LiveProgramCardViewModel from '../../ViewModel/Live/LiveProgramCardViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';

/**
* ProgramStation の View
*/
class ProgramStationView extends View {
    private viewModel: ProgramViewModel;
    private liveProgramDialogContentViewModel: LiveProgramDialogContentViewModel;
    private dialog: DialogViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.liveProgramDialogContentViewModel = <LiveProgramDialogContentViewModel>this.getModel("LiveProgramDialogContentViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        let viewConfig = this.viewModel.getViewConfig();
        if(viewConfig == null) { return m("div"); }

        return m("div", {
            id: ProgramViewModel.stationFrameId
        }, [
            m("div", {
                class: "station_title",
                style: `visibility: hidden; min-width: ${ viewConfig["timeWidth"] }px; max-width: ${ viewConfig["timeWidth"] }px;`
            }, "dummy"),

            this.createTitle(viewConfig),

            m("div", {
                class: "station_title",
                style: "visibility: hidden; min-width: 100px; max-width: 100px;"
            }, "dummy"),
        ]);
    }

    //局名を生成する
    private createTitle(viewConfig:  { [key: string]: number }): Vnode<any, any>[] {
        let result: Vnode<any, any>[] = [];
        let chennels = this.viewModel.getChannel();
        if(chennels == null) { return []; }

        let programs = this.viewModel.getProgram();
        if(programs == null) { return []; }

        if(typeof m.route.param("ch") == "undefined") {

            //非単局表示
            programs.map((program: { [key: string]: any }[], index: number) => {
                if( program.length == 0) { return; }

                if(typeof chennels![index] == "undefined") { return; }
                result.push( this.createContent(
                    chennels![index]["name"],
                    viewConfig["stationWidth"],
                    viewConfig["stationHeight"],
                    viewConfig["stationFontSize"],
                    chennels![index]
                ));
            })
        } else {
            //単局表示
            let time = this.viewModel.getTime();
            if(time == null) { return []; }
            let starttime = new Date(time["startTime"]).getTime();

            for(let i = 0; i < programs.length; i++) {
                let jaTime = DateUtil.getJaDate(new Date(starttime));

                result.push(this.createContent(
                    DateUtil.format(jaTime, "dd日 (w)"),
                    viewConfig["stationWidth"],
                    viewConfig["stationHeight"],
                    viewConfig["stationFontSize"],
                    chennels[0]
                ));
                starttime += 1000 * 60 * 60 * 24;
            }
        }

        this.viewModel.stationCnt = result.length;
        return result;
    }

    //非単局表示の中身を生成する
    private createContent(name: string, width: number, height: number, fontSize: number, channel: { [key: string]: any }): Vnode<any, any> {
        return m("div", {
            class: "station_title",
            style: `max-width: ${ width }px;`
                + `min-width: ${ width }px;`
                + `max-height: ${ height }px;`
                + `min-height: ${ height }px;`
                + `height: ${ height }px;`
                + `font-size: ${ fontSize }px;`,
            onclick: () => {
                if(typeof m.route.param("ch") == "undefined") {
                    if(this.viewModel.getLiveEnableStatus()) {
                        //live program dialog open
                        this.liveProgramDialogContentViewModel.setup(name, m.route.param("type"), channel["channel"], channel["sid"], channel["channel_disc"]);
                        this.liveProgramDialogContentViewModel.configListUpdate();
                        this.dialog.open(LiveProgramCardViewModel.dialogId);
                    } else {
                        //単局表示
                        m.route.set("/program", {
                            ch: channel["channel_disc"],
                            time: m.route.param("time")
                        });
                    }
                }
            }
        }, name);
    }
}

export default ProgramStationView;


"use strict";

import * as m from 'mithril';
import View from '../View';
import Util from '../../Util/Util';
import DateUtil from '../../Util/DateUtil';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';
import DialogViewModel from '../../ViewModel/Dialog/DialogViewModel';
import ProgramInfoDialogViewModel from '../../ViewModel/Program/ProgramInfoDialogViewModel';
import ProgramStorageViewModel from '../../ViewModel/Program/ProgramStorageViewModel';

/**
* ProgramTime の View
*/

class ProgramTimeView extends View {
    private viewModel: ProgramViewModel;
    private dialog: DialogViewModel;
    private viewConfig: { [key: string]: any };
    private infoDialogViewModel: ProgramInfoDialogViewModel;
    private storedGenre: { [key: number]: boolean; };

    public execute(): Mithril.VirtualElement {
        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.infoDialogViewModel = <ProgramInfoDialogViewModel>this.getModel("ProgramInfoDialogViewModel");
        this.dialog = <DialogViewModel>this.getModel("DialogViewModel");

        this.viewConfig = this.viewModel.getViewConfig();
        let time = this.viewModel.getTime();

        //表示ジャンル読み出し
        this.storedGenre = (<ProgramStorageViewModel>this.getModel("ProgramStorageViewModel")).get();
        if(this.storedGenre == null) { this.storedGenre = {}; }

        let waitTime = Util.uaIsMobile ? 800 : 100;

        let result: Mithril.VirtualElement[] = [];
        this.viewModel.getProgram().map((stationPrograms: { [key: string]: any }[], i: number) => {
            if(stationPrograms.length == 0) { return; }
            let nextTime: number; //次の番組の開始時間
            let stationEndTime: number; //局の番組表示終了時間

            //開始時刻設定
            if(typeof m.route.param("ch") == "undefined") {
                //非単局表示
                nextTime = new Date(time["startTime"]).getTime()
                stationEndTime = new Date(time["endTime"]).getTime();
            } else {
                //単局表示
                nextTime = new Date(time["startTime"]).getTime() + (i * 1000 * 60 * 60 * 24);
                stationEndTime = new Date(time["startTime"]).getTime() + ((i + 1) * 1000 * 60 * 60 * 24);
            }

            result.push( m("div", {
                class: "station",
                config: (element, isInit, context) => {
                    if(!isInit) { context["updateTime"] = null; }

                    //子要素の更新が必要
                    if( context["updateTime"] == null || context["updateTime"] < this.viewModel.getUpdateTime()) {
                        context["updateTime"] = this.viewModel.getUpdateTime();

                        //キャッシュをリセットする
                        if(i == 0) {
                            this.viewModel.resetCache();
                            //プログレスを非表示にする
                            setTimeout(() => { this.viewModel.hiddenProgressStatus(); }, waitTime);
                        }

                        //remove child
                        for (let i = element.childNodes.length - 1; i >= 0; i--) {
                            element.removeChild(element.childNodes[i]);
                        }

                        //add new child
                        let stationChild = this.createStationChild(nextTime, stationEndTime, stationPrograms);
                        stationChild.map((child: HTMLElement) => {
                            if(Util.uaIsMobile()) {
                                setTimeout(() => { element.appendChild(child); }, waitTime);
                            } else {
                                element.appendChild(child);
                            }
                        });
                    }
                }
            }) );
        })

        return m("div", {
            id: "program_content",
            class: "fadeIn",
            style: "margin-top: -2px;", //時刻線の分
            config: (element, isInit) => {
                this.addShowAnimetion(element, isInit);
            }
        }, result);
    }

    /**
    * 局ごとの要素を生成する
    */
    private createStationChild(nextTime: number, stationEndTime: number, stationPrograms: { [key: string]: any }[]): Element[] {
        let stationChild: Element[] = [];

        //局の番組1つ1つを map で生成する
        stationChild.push( this.createEmptyElement() );

        stationPrograms.map((program, j) => {
            let programStartTime = new Date(program["starttime"]).getTime(); //番組の開始時間
            let programEndTime = new Date(program["endtime"]).getTime(); //番組の終了時間

            if( nextTime > programStartTime) {
                programStartTime = nextTime;
            } else if(programStartTime != nextTime) {
                //前の番組の終了時刻と、開始時間に空きができたため、dummy を挟む
                let height = this.contentHeight(nextTime, programStartTime);
                stationChild.push( this.dummyContent(height) );
                nextTime = programStartTime;
            }

            //局の番組表示終了時間を超えてたら修正する
            if(programEndTime > stationEndTime) { programEndTime = stationEndTime; }

            //通所の番組表示処理
            let height = this.contentHeight(programStartTime, programEndTime);
            stationChild.push(this.createContent(program, height));

            //終了時刻を次の開始時刻とする
            nextTime = programEndTime;

            //全ての番組が表示終わっってかつ、局の表示時刻と終了時刻の間が空いていたら
            if(stationPrograms.length - 1 == j && stationEndTime > nextTime) {
                //終了時刻と番組間で空きができたため, dummy を挟む
                let height = this.contentHeight(nextTime, stationEndTime);
                stationChild.push( this.dummyContent(height) );
            }
        });

        return stationChild;
    }

    //子要素付き Element を生成する
    private createParentElement(tag: string, attrs: { [key: string]: any }, childs: Element[], time: number | null = null): Element {
        let element = document.createElement(tag);
        for(let key in attrs) {
            if(key == "onclick") {
                element.onclick = attrs[key];
            } else {
                element.setAttribute(key, attrs[key]);
            }
        }

        //子要素追加
        childs.map((child: HTMLElement) => {
            if(time == null || time == -1) { element.appendChild(child); }
            else { setTimeout(() => { element.appendChild(child); }, time); }
        });

        return element;
    }

    //テキストを持つ Element 生成する
    private createTextElement(tag: string, attrs: { [key: string]: string }, text: string): Element {
        let element = document.createElement(tag);
        for(let key in attrs) { element.setAttribute(key, attrs[key]); }
        element.innerText = text;

        return element;
    }

    //空の要素を生成 各局の先頭に置く
    private createEmptyElement(): Element {
        return this.createParentElement("div", { style: "height: 0px;" }, [
            this.createTextElement("div", { style: "visibility: hidden;" }, "dummy")
        ]);
    }

    /**
    * 番組の高さを返す
    * @param startTime 開始時刻 ミリ秒
    * @param endTime 終了時刻 ミリ秒
    */
    private contentHeight(startTime: number, endTime: number): number {
        startTime = Math.floor(new Date(startTime).getTime() / 10000) * 10000;
        endTime = Math.floor(new Date(endTime).getTime() / 10000) * 10000;

        let height = Math.ceil(( endTime - startTime ) / 1000 / 60);

        return height * this.viewConfig["timeHeight"] / 60;
    }

    /**
    * dummy 番組を返す
    * @param height 番組高さ
    */
    private dummyContent(height: number): Element {
        return this.createParentElement("div", {
            class: "tv_program",
            style: `height: ${ height }px;`
                + `max-width: ${ this.viewConfig["stationWidth"] }px;`
                + `min-width: ${ this.viewConfig["stationWidth"] }px;`
        }, [
            this.createTextElement("div", {
                class: "pr_title",
                style: `font-size: ${ this.viewConfig["titleSize"] }pt;`
            }, "放送休止")
        ]);
    }

    /**
    * 番組要素を生成する
    * @param program program
    * @param height 番組の高さ
    */
    private createContent(program: { [key: string]: any }, height: number):  Element {
        if(height == 0) { return document.createElement("div"); }

        let classStr = "tv_program ";
        classStr += `ctg_${ program["category_id"] } `

        //表示ジャンル
        if(typeof this.storedGenre[program["category_id"]] != "undefined" && !this.storedGenre[program["category_id"]]) { classStr += "ctg-hide "; }

        if(program["recorded"]) { classStr += `${ ProgramViewModel.recordedClassStr  } `; } //予約枠線
        if(program["autorec"] == 0) { classStr += `${ ProgramViewModel.autorecClassStr } `; } //自動予約禁止

        let element = this.createParentElement("div", {
            id: `prgID_${ program["id"] }`,
            class: classStr,
            style: `height: ${ height }px; max-width: ${ this.viewConfig["stationWidth"] }px; min-width: ${ this.viewConfig["stationWidth"] }px;`,
            onclick: () => {
                //キャッシュを反映させる
                let copyProgram = JSON.parse(JSON.stringify(program));
                let cache = this.viewModel.getCache(copyProgram["id"]);
                if(cache != null) {
                    copyProgram["autorec"] = cache["autorec"];
                    copyProgram["recorded"] = cache["recorded"];
                }

                //get channel
                let channel: { [key: string]: any } | null = null;
                this.viewModel.getChannel().map((c: { [key: string]: any }) => {
                    if(c["id"] == program["channel_id"]) { channel = c; }
                });

                if(channel == null) {
                    console.log('program dialog channel error');
                    return;
                }

                //open program info dialog
                this.infoDialogViewModel.setProgram(
                    copyProgram,
                    channel,
                    this.viewModel.getRecMode(),
                    this.viewModel.getRecModeDefaultId()
                );
                this.dialog.open(ProgramInfoDialogViewModel.infoDialogId);
                //m.redraw.strategy("diff");
                m.redraw();
            }
        }, [
            //title
            this.createTextElement("div", {
                class: "pr_title",
                style: `font-size: ${ this.viewConfig["timeSize"] }pt;`
            }, program["title"]),

            //time
            this.createTextElement("div", {
                class: "pr_starttime",
                style: `font-size: ${ this.viewConfig["timeSize"] }pt;`
            }, this.createStartTimeStr(program["starttime"])),

            //description
            this.createTextElement("div", {
                class: "pr_description",
                style: `font-size: ${ this.viewConfig["descriptionSize"] }pt;`
            }, program["description"]),
        ]);

        //program をキャッシュする
        this.viewModel.addCache(program["id"], program["autorec"], program["recorded"], element);

        return element;
    }

    /**
    * 番組の開始時刻を生成する
    */
    public createStartTimeStr(timeStr: string): string {
        let start = DateUtil.getJaDate(new Date(timeStr));
        return DateUtil.format(start, "hh:mm:ss");
    }
}

export default ProgramTimeView;


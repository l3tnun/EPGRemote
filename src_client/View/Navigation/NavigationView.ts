"use strict";

import * as m from 'mithril';
import { Vnode } from 'mithril';
import View from '../View';
import NavigationViewModel from '../../ViewModel/Navigation/NavigationViewModel';
import Util from '../../Util/Util';

/**
* Navigation 部分の View
*/
class NavigationView extends View {
    private viewModel: NavigationViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <NavigationViewModel>this.getModel("NavigationViewModel");

        return m("div", { class: "mdl-layout__drawer",
            oncreate: () => { Util.upgradeMdl(); }
        }, [
            this.createLiveStreamContent(), //ライブ配信リンク
            this.createStreamingList(), //配信中リンク
            m("span", { class: "mdl-layout-title drawer-subhead" }, [ "epgrec" ]),
            m("nav", { class: "mdl-navigation" }, [
                m("div", [
                    this.viewModel.getBroadCastList().map((data: string) => {
                        return this.createLink(`番組表(${ data })`, `/program?type=${data}`)
                    })
                ]),
                this.createLink("録画済み一覧", "/recorded"),
                this.createLink("録画予約一覧", "/reservation"),
                this.createLink("番組検索", "/search"),
                this.createLink("自動録画キーワードの管理", "/keyword"),
                this.createLink("epgrec 動作ログ", "/log")
            ])
        ]);
    }

    //ライブ配信用のリンクを作成する
    private createLiveStreamContent(): Vnode<any, any>[] {
        //配信が無効
        if(!this.viewModel.enableLive()) { return []; }

        let broadCastList = this.viewModel.getBroadCastList();
        return [
            m("span", { class: "mdl-layout-title drawer-subhead" }, [ "Live Stream" ]),
            m("nav", { class: "mdl-navigation" }, [
                broadCastList.map((data: string) => {
                    return this.createLink(`番組表(${ data })`, `/live/program?type=${ data }`)
                })
            ]),
            m("div", { class: "drawer-separator" }),
        ]
    }

    //配信中の一覧を作成する
    private createStreamingList(): Vnode<any, any>[] {
        let streamInfo = this.viewModel.getLiveOtherStreamInfoList();
        let result: Vnode<any, any>[] = [];

        streamInfo.map((data, index) => {
            if(data["streamType"] == "live" || data["streamType"] == "recorded") {
                result.push( this.createLink(`${data.name}`, `/live/watch?stream=${data.streamNumber}`) );
            } else if(data["streamType"] == "http-live") {
                result.push( this.createHttpViewLink(data) );
            } else if(data["streamType"] == "http-pc-live") {
                result.push( this.createHttpPCViewLink(data) );
            }

            if(streamInfo.length == index + 1) {
                result.push(m("div", { class: "drawer-separator" }))
            };
        })

        if(result.length > 0) {
            return [
                m("span", { class: "mdl-layout-title drawer-subhead" }, "配信中"),
                m("nav", { class: "mdl-navigation" }, result)
            ];
        }

        return [];
    }

    //navigation を閉じる
    private close(): void {
        let navi = document.getElementsByClassName("mdl-layout__obfuscator");
        if(navi.length > 0) {
            let button = <HTMLElement> navi[0];
            button.click();
        }
    }

    /**
    * navigation の link を生成する
    * @param name 表示されるリンクの名前
    * @param href リンクのアドレス
    */
    private createLink(name: string, href: string): Vnode<any, any> {
        return m("a", {
            class: "mdl-navigation__link",
            onclick: () => {
                this.close();
                setTimeout(() => {
                    if(m.route.get() == href) { return; }
                    m.route.set(href);
                }, 100);
            }
        }, name);
    }

    private createHttpViewLink(data: { [key: string]: any }): Vnode<any, any> {
        return m("a", {
            class: "mdl-navigation__link",
            onclick: () => {
                let query = Util.buildQueryStr({
                    channel: data.channel,
                    sid: data.sid,
                    tuner: data.tunerId,
                    video: data.videoId
                });

                let path = window.location.host + `/api/live/http/watch?${ query }`;
                let mobilePath = window.location.host + encodeURIComponent(`/api/live/http/watch?${ query }`);

                if(Util.uaIsiOS()) {
                    let url = this.viewModel.getHttpViewIOSURL();
                    if(url == null) { alert("HttpLiveViewiOSURL の設定をしてください。"); return; }
                    location.href = url.replace("ADDRESS", mobilePath);

                } else if(Util.uaIsAndroid()) {
                    let url = this.viewModel.getHttpViewAndroidURL();
                    if(url == null) { alert("HttpLiveViewAndroidURL の設定をしてください。"); return; }
                    location.href = url.replace("ADDRESS", path);
                } else {
                    alert(`お使いの端末は http 再生に対応していません。VLC Media Player 等で次のリンクを開いてください。${ location.protocol }//${ path }`);
                }
            }
        }, data.name);
    }

    private createHttpPCViewLink(data: { [key: string]: any }): Vnode<any, any> {
        return m("a", {
            class: "mdl-navigation__link drawer-busy",
            onclick: () => {
                alert('この配信は配信を開始した端末からしか視聴できません。');
            }
        }, data.name);
    }
}

export default NavigationView;


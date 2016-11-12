"use strict";

import * as m from 'mithril';
import ViewModel from '../ViewModel';
import Util from '../../Util/Util';
import { SearchConfigApiModelInterface } from '../../Model/Api/Search/SearchConfigApiModel';
import { SearchKeywordConfigApiModelInterface } from '../../Model/Api/Search/SearchKeywordConfigApiModel';
import { SearchResultApiModelInterface } from '../../Model/Api/Search/SearchResultApiModel';
import { SearchResultOptionInterface } from '../../Model/Api/Search/SearchResultApiModel';
import { AddKeywordEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/AddKeywordEpgrecModuleModel';
import { AddKeywordEpgrecModuleQuery } from '../../Model/Api/EpgrecModule/AddKeywordEpgrecModuleModel';

/**
* Search の ViewModel
*/
class SearchViewModel extends ViewModel {
    private searchConfigApiModel: SearchConfigApiModelInterface;
    private searchKeywordConfigApiModel: SearchKeywordConfigApiModelInterface;
    private searchResultApiModel: SearchResultApiModelInterface;
    private addKeywordEpgrecModuleModel: AddKeywordEpgrecModuleModelInterface;

    //search option
    public keyword: string;
    public useRegexp: boolean;
    public collateCi: boolean;
    public enableTitle: boolean;
    public enableDescription: boolean
    public channelValue: number;
    public typeGR: boolean;
    public typeBS: boolean;
    public typeCS: boolean;
    public typeEX: boolean;
    public genreValue: number;
    public subGenreValue: number;
    public firstGenre: boolean; //全保持
    public programTimeValue: number;
    public periodValue: number;
    public week0: boolean;
    public week1: boolean;
    public week2: boolean;
    public week3: boolean;
    public week4: boolean;
    public week5: boolean;
    public week6: boolean;

    //search option status
    public isInitSubGenre: boolean;

    //add keyword option
    public keywordEnable: boolean;
    public overlap: boolean;
    public restAlert: boolean;
    public criterionDura: boolean;
    public discontinuity: boolean;
    public sftStart: number;
    public sftEnd: number;
    public splitTime: number;
    public priority: number;
    public autorecMode: number;
    public directory: string;
    public filenameFormat: string;
    public transConfig: { [key: string]: any }[];
    public tsDelete: boolean;

    /**
    * search result show status
    * true: 表示, false: 非表示
    */
    public resultShowStatus: boolean;

    /**
    * scroll status
    * true: スクロールする, false: スクロールしない
    */
    public scrollStatus: boolean;

    constructor(
        _searchConfigApiModel: SearchConfigApiModelInterface,
        _searchKeywordConfigApiModel: SearchKeywordConfigApiModelInterface,
        _searchResultApiModel: SearchResultApiModelInterface,
        _addKeywordEpgrecModuleModel: AddKeywordEpgrecModuleModelInterface
    ) {
        super();

        this.searchConfigApiModel = _searchConfigApiModel;
        this.searchKeywordConfigApiModel = _searchKeywordConfigApiModel;
        this.searchResultApiModel = _searchResultApiModel;
        this.addKeywordEpgrecModuleModel = _addKeywordEpgrecModuleModel;
    }

    /**
    * 初期化
    * controller からページ読み込み時に呼ばれる
    * search config -> keyword config の順で取得する
    */
    public init(): void {
        //search config を取得
        this.searchConfigApiModel.update(() => {
            //search config 取得後の処理
            this.setBroadCastValueFromConfig(); //放送波設定
            this.initAddKeywordOption();

            //keyword config を取得
            let keyword_id = m.route.param("keyword_id");
            if(typeof keyword_id != "undefined") {
                this.searchKeywordConfigApiModel.update(Number(keyword_id), () => {
                    this.setSearchOptionFromKeyword(); //search option をセット
                    this.setAddKeywordOptionFromKeyword(); //add keyword option をセット
                    setTimeout(() => {
                        //サブジャンルセットを待つ
                        this.search();
                    }, 500);
                });
            } else if(typeof m.route.param("search") != "undefined"){
                this.search();
            }
        });

        this.searchResultInit(); //検索結果を空に
        this.initSearchOption(); //option を初期化
        this.scrollStatus = false;
    }

    /**
    * 放送波の value をセット
    * 放送波がすべて false だったら broadcast に基づいて有効化する
    */
    private setBroadCastValueFromConfig(): void {
        if(this.typeGR || this.typeBS || this.typeCS || this.typeEX) {
            return;
        }
        let broadcast = this.getBroadcast();
        if(broadcast["GR"]) { this.typeGR = true; }
        if(broadcast["BS"]) { this.typeBS = true; }
        if(broadcast["CS"]) { this.typeCS = true; }
        if(broadcast["EX"]) { this.typeEX = true; }
    }

    //検索オプションを初期化
    public initSearchOption(): void {
        this.keyword = "";
        this.useRegexp = false;
        this.collateCi = false;
        this.enableTitle = false;
        this.enableDescription = false;
        this.channelValue = 0;
        this.typeGR = false;
        this.typeBS = false;
        this.typeCS = false;
        this.typeEX = false
        this.genreValue = 0;
        this.subGenreValue = 0;
        this.firstGenre = false;
        this.programTimeValue = 24;
        this.periodValue = 1;
        this.week0 = true;
        this.week1 = true;
        this.week2 = true;
        this.week3 = true;
        this.week4 = true;
        this.week5 = true;
        this.week6 = true;

        this.setSearchOptionFromQuery(); //query から option をセット
        this.setBroadCastValueFromConfig();
        this.isInitSubGenre = false;
    }

    //add keyword オプションを初期化
    public initAddKeywordOption(): void {
        this.keywordEnable = true;
        this.overlap = false;
        this.restAlert = false;
        this.criterionDura = false;
        this.discontinuity = false;
        this.sftStart = 0;
        this.sftEnd = 0;
        this.splitTime = 0;
        this.priority = 10;
        this.autorecMode = this.getRecModeDefaultId();
        this.directory = "";
        this.filenameFormat = "";
        this.transConfig = [
            { mode: 0, dir: "" },
            { mode: 0, dir: "" },
            { mode: 0, dir: "" }
        ];
        this.tsDelete = false;
    }

    //検索結果を初期化
    public searchResultInit(): void {
        this.resultShowStatus = false;
        this.searchResultApiModel.init();
    }

    /**
    * query から search option を設定する
    * /program の番組検索で query が設定される
    */
    public setSearchOptionFromQuery(): void {
        let query = Util.getCopyQuery();

        if(typeof query["search"] != "undefined") { this.keyword = query["search"]; }
        let type = query["type"];
        if(typeof type != "undefined") {
            if(type == "GR") { this.typeGR = true; }
            if(type == "BS") { this.typeBS = true; }
            if(type == "CS") { this.typeCS = true; }
            if(type == "EX") { this.typeEX = true; }
        }
        if(typeof query["channel_id"] != "undefined") { this.channelValue = query["channel_id"]; }
        if(typeof query["category_id"] != "undefined"){ this.genreValue =  query["category_id"]; }
        if( typeof query["sub_genre"] != "undefined" ) {
            setTimeout(() => {
                this.subGenreValue = query["sub_genre"];
                m.redraw(true);
            }, 100);
        }
    }

    /**
    * keyword id から search option を設定する
    */
    public setSearchOptionFromKeyword(): void {
        let config = this.searchKeywordConfigApiModel.getConfig();
        if(config == null) { return; }

        this.keyword = config.keyword;
        this.useRegexp = config.use_regexp;
        this.collateCi = config.collate_ci;
        this.enableTitle = config.ena_title;
        this.enableDescription = config.ena_desc;
        this.channelValue = config.channel_id;
        this.genreValue = config.category_id;
        this.firstGenre = !config.firstGenre; //first_genre は DB 上で逆になっている
        this.programTimeValue = config.startTime;
        this.periodValue = config.periodTime;
        this.week0 = config.weekofdays[0];
        this.week1 = config.weekofdays[1];
        this.week2 = config.weekofdays[2];
        this.week3 = config.weekofdays[3];
        this.week4 = config.weekofdays[4];
        this.week5 = config.weekofdays[5];
        this.week6 = config.weekofdays[6];

        setTimeout(() => {
            if(config == null) { return; }
            this.typeGR = config.typeGR;
            this.typeBS = config.typeBS;
            this.typeCS = config.typeCS;
            this.typeEX = config.typeEX;
            this.subGenreValue = config.subGenre_id;
            m.redraw(true);
        }, 100);
    }

    /**
    * keyword id から add keyword option を設定する
    */
    public setAddKeywordOptionFromKeyword(): void {
        let config = this.searchKeywordConfigApiModel.getConfig();
        if(config == null) { return; }

        this.keywordEnable = config.kw_enable;
        this.overlap = config.overlap;
        this.restAlert = config.rest_alert;
        this.criterionDura = config.criterion_dura;
        this.discontinuity = config.discontinuity;
        this.sftStart = config.sft_start;
        this.sftEnd = config.sft_end;
        this.splitTime = config.split_time;
        this.priority = config.priority;
        this.autorecMode = config.autorec_mode;
        this.directory = config.directory;
        this.filenameFormat = config.filenameFormat;
        this.transConfig = config.transConfig;
        this.tsDelete = config.ts_del;
    }

    //検索実行
    public search(): void {
        //検索オプションのチェック

        //検索ワードが空
        if(this.keyword == "") {
            this.useRegexp = false;
            this.collateCi = false;
            this.enableTitle = false;
            this.enableDescription = false;
        } else {
            //キーワードが空でなく、タイトル、概要が有効になっていない
            if(!this.enableTitle && !this.enableDescription) {
                this.enableTitle = true;
                this.enableDescription = true;
            }
        }

        //曜日がすべて無効
        if(!this.week0 && !this.week1 && !this.week2 && !this.week3 && !this.week4 && !this.week5 && !this.week6) {
            this.week0 = true;
            this.week1 = true;
            this.week2 = true;
            this.week3 = true;
            this.week4 = true;
            this.week5 = true;
            this.week6 = true;
        }

        //選択された放送局と放送波の選択が正しいかチェックする
        let channel: { [key: number]: { [key: string]: any }[] } | null = null;
        this.getChannel().map((c: { [key: string]: any }) => {
            if(c["id"] == this.channelValue) { channel = c; }
        });

        if(channel != null) {
            //channel id に合わせて放送波を設定する
            if(channel["type"] == "GR") {
                this.typeGR = true;
                this.typeBS = false;
                this.typeCS = false;
                this.typeEX = false;
            } else if(channel["type"] == "BS") {
                this.typeGR = false;
                this.typeBS = true;
                this.typeCS = false;
                this.typeEX = false;
            } else if(channel["type"] == "CS") {
                this.typeGR = false;
                this.typeBS = false;
                this.typeCS = true;
                this.typeEX = false;
            } else if(channel["type"] == "EX") {
                this.typeGR = false;
                this.typeBS = false;
                this.typeCS = false;
                this.typeEX = true;
            }
        } else {
            //放送局が指定されていなく、すべての放送波が無効ならば broadcast で有効な放送波を有効にする
            let boradcast = this.getBroadcast();

            let enableTypes = {};
            if(boradcast["GR"]) { enableTypes["GR"] = { get: () => { return this.typeGR; }, set: (value: boolean) => { this.typeGR = value; } } };
            if(boradcast["BS"]) { enableTypes["BS"] = { get: () => { return this.typeBS; }, set: (value: boolean) => { this.typeBS = value; } } };
            if(boradcast["CS"]) { enableTypes["CS"] = { get: () => { return this.typeCS; }, set: (value: boolean) => { this.typeCS = value; } } };
            if(boradcast["EX"]) { enableTypes["EX"] = { get: () => { return this.typeEX; }, set: (value: boolean) => { this.typeEX = value; } } };

            //放送波がすべて無効か確認する
            let typesEnableFlag = true;
            for(let key in enableTypes) { if(enableTypes[key].get()) { typesEnableFlag = false; } }

            //broadcast で有効な放送波を有効にする
            if(typesEnableFlag) {
                for(let key in enableTypes) { enableTypes[key].set(true); }
            }
        }

        let option: SearchResultOptionInterface = {
            search: this.keyword,
            use_regexp: this.useRegexp,
            collate_ci: this.collateCi,
            ena_title: this.enableTitle,
            ena_desc: this.enableDescription,
            typeGR: this.typeGR,
            typeBS: this.typeBS,
            typeCS: this.typeCS,
            typeEX: this.typeEX,
            first_genre: this.firstGenre,
            period: this.periodValue,
            week0: this.week0,
            week1: this.week1,
            week2: this.week2,
            week3: this.week3,
            week4: this.week4,
            week5: this.week5,
            week6: this.week6,
            channel_id: this.channelValue,
            category_id: this.genreValue,
            sub_genre: this.subGenreValue,
            prgtime: this.programTimeValue
        };

        this.searchResultApiModel.setOption(option);
        this.searchResultApiModel.update();
        this.resultShowStatus = true;
        this.scrollStatus = true;
    }

    public getGenres(): { [key: string]: any }[] {
        return this.searchConfigApiModel.getGenres();
    }

    public getChannel(): { [key: string]: any }[] {
        return this.searchConfigApiModel.getChannel();
    }

    public getSubGenre(): { [key: number]: { [key:number]: string } } {
        return this.searchConfigApiModel.getSubGenre();
    }

    public getRecMode(): { [key: string]: any }[] {
        return this.searchConfigApiModel.getRecMode();
    }

    public getStartTranscodeId(): number {
        let value = this.searchConfigApiModel.getStartTranscodeId();
        return value == null ? -1 : value;
    }

    public getRecModeDefaultId(): number {
        let value = this.searchConfigApiModel.getRecModeDefaultId();
        return value == null ? -1 : value;
    }

    public getBroadcast(): { [key: string]: boolean; } {
        return this.searchConfigApiModel.getBroadcast();
    }

    //検索結果
    public getResult(): { [key: string]: any }[] {
        return this.searchResultApiModel.getResult();
    }

    //自動キーワード追加 or 更新
    public addKeyword(): void {
        let option: AddKeywordEpgrecModuleQuery = {
            keyword:            this.keyword,
            use_regexp:         this.useRegexp,
            collate_ci:         this.collateCi,
            ena_title:          this.enableTitle,
            ena_desc:           this.enableDescription,
            typeGR:             this.typeGR,
            typeBS:             this.typeBS,
            typeCS:             this.typeCS,
            typeEX:             this.typeEX,
            channel_id:         this.channelValue,
            category_id:        this.genreValue,
            sub_genre:          this.subGenreValue,
            first_genre:        !this.firstGenre, //first_genre は DB 上で逆になっている
            prgtime:            this.programTimeValue,
            period:             this.periodValue,
            week0:              this.week0,
            week1:              this.week1,
            week2:              this.week2,
            week3:              this.week3,
            week4:              this.week4,
            week5:              this.week5,
            week6:              this.week6,
            kw_enable:          this.keywordEnable,
            overlap:            this.overlap,
            rest_alert:         this.restAlert,
            criterion_dura:     this.criterionDura,
            discontinuity:      this.discontinuity,
            sft_start:          this.sftStart,
            sft_end:            this.sftEnd,
            split_time:         this.splitTime,
            priority:           this.priority,
            autorec_mode:       this.autorecMode,
            directory:          this.directory,
            filename_format:    this.filenameFormat,
            trans_mode0:        this.transConfig[0]["mode"],
            transdir0:          this.transConfig[0]["dir"],
            trans_mode1:        this.transConfig[1]["mode"],
            transdir1:          this.transConfig[1]["dir"],
            trans_mode2:        this.transConfig[2]["mode"],
            transdir2:          this.transConfig[2]["dir"],
            ts_del:             this.tsDelete
        }

        this.addKeywordEpgrecModuleModel.execute(option);
    }
}

export default SearchViewModel;


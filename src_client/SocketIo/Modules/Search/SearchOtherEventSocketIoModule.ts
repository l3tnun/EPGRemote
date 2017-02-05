"use strict";

import * as m from 'mithril';
import SocketIoModule from '../SocketIoModule';
import { SearchResultApiModelInterface } from '../../../Model/Api/Search/SearchResultApiModel';

/*
* 他の socketio のイベントで SearchResultApiModel を更新する
*/
class SearchOtherEventSocketIoModule extends SocketIoModule {
    private searchResultApModel: SearchResultApiModelInterface;

    constructor(_searchResultApModel: SearchResultApiModelInterface) {
        super();
        this.searchResultApModel = _searchResultApModel;
    }

    public getName(): string { return "searchOtherEvent"; }

    public getEventName(): string[] {
        return [
            "recordedDeleteVideo",
            "reservationCancelRec",
            "keywordDelete",
            "keywordEnable",
            "keywordAdd"
        ];
    }

    public execute(_option: { [key: string]: any; }): void {
        this.searchResultApModel.update();
    }
}

export default SearchOtherEventSocketIoModule;


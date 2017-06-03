"use strict";

import ViewModel from '../ViewModel';
import { StorageModelInterface } from '../../Model/Storage/StorageModel';

class ProgramStorageViewModel extends ViewModel {
    private storageModel: StorageModelInterface;
    private useStatus: boolean = true; //localstorage が使用可能かを表す true: 使用可, false: 使用不可
    public tmpGenre: { [key: number]: boolean; } | null = null; //genre 一時記憶

    constructor(_storageModel: StorageModelInterface) {
        super();
        this.storageModel = _storageModel;
    }

    /**
    * 初期化処理
    * 表示ジャンル情報がなければ生成する
    */
    public init(): void {
        let storedGenre = this.get();

        //表示ジャンル情報がなければ作成する
        if(storedGenre == null) {
            let value = {};
            for(let i = 1; i <= 16; i++) { value[i] = true; }
            try {
                this.storageModel.set("genre", value);
            } catch(e) {
                this.useStatus = false;
                console.log("ProgramStorageViewModel storage write error");
                console.log(e);
            }
        }

        this.tmpGenre = this.get();
    }

    //ジャンル情報の取得
    public get(): { [key: number]: boolean; } | null {
        return this.storageModel.get(ProgramStorageViewModel.storageKey);
    }

    //ジャンル情報の削除
    public remove(): void {
        this.storageModel.remove(ProgramStorageViewModel.storageKey);
    }

    //ジャンル情報の更新
    public update(): void {
        if(!this.useStatus || this.tmpGenre == null) { return; }
        this.storageModel.set(ProgramStorageViewModel.storageKey, this.tmpGenre);
    }
}

namespace ProgramStorageViewModel {
    export const genreDialogId = "program_genre";
    export const storageKey = "genre";
}

export default ProgramStorageViewModel;


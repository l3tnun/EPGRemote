"use strict";

import ViewModel from '../ViewModel';
import { StorageModelInterface } from '../../Model/Storage/StorageModel';

class ProgramStorageViewModel extends ViewModel {
    private storageModel: StorageModelInterface;
    private useStatus = true; //localstorage が使用可能かを表す true: 使用可, false: 使用不可

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
            for(var i = 1; i <= 16; i++) { value[i] = true; }
            try {
                this.storageModel.set("genre", value);
            } catch(e) {
                this.useStatus = false;
                console.log("ProgramStorageViewModel storage write error");
                console.log(e);
            }
        }
    }

    //ジャンル情報の取得
    public get(): { [key: number]: boolean; } {
        return this.storageModel.get(ProgramStorageViewModel.storageKey);
    }

    //ジャンル情報の削除
    public remove(): void {
        this.storageModel.remove(ProgramStorageViewModel.storageKey);
    }

    //ジャンル情報の更新
    public update(value: { [key: number]: boolean; }): void {
        if(!this.useStatus) { return; }
        this.storageModel.set(ProgramStorageViewModel.storageKey, value);
    }
}

namespace ProgramStorageViewModel {
    export const genreDialogId = "program_genre";
    export const storageKey = "genre";
}

export default ProgramStorageViewModel;


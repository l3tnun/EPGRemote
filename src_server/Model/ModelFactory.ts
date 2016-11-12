"use strict";

import Model from './Model';

/**
* ModelFactory
* Model のインスタンスを生成する
* @throw ModelFactoryModelFindError 該当の Model インスタンス生成方法が存在しない場合発生する
*/
class ModelFactory {
    private static instance: ModelFactory;
    private table: { [key: string]: () => Model } = {};

    public static getInstance(): ModelFactory {
        if(!this.instance) {
            this.instance = new ModelFactory();
        }

        return this.instance;
    }

    private constructor() {}

    /**
    * Model インスタンスの生成方法を登録する
    * @param name Model name
    * @param model Model
    */
    public add(name: string, callback: () => Model): void {
        this.table[name] = callback;
    }

    /**
    * Model インスタンスを取得する
    * @param name Model name
    * @throw ModelFactoryModelFindError 該当の Model インスタンス生成方法が存在しない場合発生する
    */
    public get(name: string): Model {
        let model = this.table[name];
        if(typeof model == "undefined") {
            console.log(`${ name } Model is not found.`);
            throw new Error("ModelFactoryModelFindError");
        }

        return model();
    }
}

export default ModelFactory;


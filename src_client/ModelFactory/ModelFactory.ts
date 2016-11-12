"use strict";

import Model from '../Model/Model';

/**
* ModelFactory
* Model のインスタンスが一つであることを保証する
* @throw ModelFactoryModelFindError getModel() 時に該当の Model が存在しない場合発生する
*/

class ModelFactory {
    private static instance: ModelFactory;
    private table: { [key: string]: Model } = {};

    public static getInstance(): ModelFactory {
        if(!this.instance) {
            this.instance = new ModelFactory();
        }

        return this.instance;
    }

    private constructor() {}

    /**
    * Model をセットする
    * @param name name
    * @param model Model
    */
    public add(name: string, model: Model): void {
        this.table[name] = model;
    }

    /**
    * Model を取得する
    * @param name name
    * @throw ModelFactoryModelFindError 該当の Model が存在しない場合発生する
    */
    public get(name: string): Model {
        let model = this.table[name];
        if(typeof model == "undefined") {
            console.log(`${ name } Model is not found.`);
            throw new Error("ModelFactoryModelFindError");
        }

        return model;
    }
}

export default ModelFactory;


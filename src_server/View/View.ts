"use strict";

import Base from '../Base';
import Model from '../Model/Model';

abstract class View extends Base {
    protected models: {}  = {};

    public setModels(_models: { [key: string]: Model; }): void {
        this.models = _models;
    }

    public getModel(name: string): Model {
        return this.models[name];
    }

    public abstract execute(): void;
}

export default View;


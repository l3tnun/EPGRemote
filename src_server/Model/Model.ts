"use strict";

import * as events from 'events';
import View from '../View/View';
import Base from '../Base';

abstract class Model extends Base {
    protected listners: events.EventEmitter = new events.EventEmitter();
    protected option: { [key: string]: any } = {};

    public addViewEvent(view: View): void {
        this.listners.once("view", () => view.execute());
    }

    public setOption(_option: {}): void {
        this.option = {};
        for(let key in _option) {
            if(typeof _option[key] != "undefined" && String(_option[key]) != 'NaN' && _option[key] != null) {
                this.option[key] = _option[key];
            }
        }
    }

    protected eventsNotify(): void {
        this.listners.emit("view");
    }

    public abstract execute(): void;
}

export default Model


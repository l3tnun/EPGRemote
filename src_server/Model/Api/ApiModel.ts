"use strict";

import Model from '../Model';

abstract class ApiModel extends Model {
    protected results: any = null;
    protected errors: any = null;

    public abstract execute(): void;

    //viewから操作
    public getResults(): any {
        return this.results;
    }

    public getErrors(): any {
        return this.errors;
    }

    protected getRandtime(): number {
        return ( Math.floor(Math.random()*(10-1)+10) * 1000);
    }

    protected checkNull(value: any): boolean {
        return (typeof value == "undefined" || value == null);
    }
}

export default ApiModel;


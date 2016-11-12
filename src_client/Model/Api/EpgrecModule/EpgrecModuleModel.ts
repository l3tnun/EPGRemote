"use strict";

import Model from '../../Model';
import ModelFactory from '../../../ModelFactory/ModelFactory';
import { DialogModelInterface } from '../../Dialog/DialogModel';
import { SnackbarModelInterface } from '../../Snackbar/SnackbarModel';

/**
* epgrec の操作をするクラス
*/
abstract class EpgrecModuleModel extends Model {
    protected dialog: DialogModelInterface;
    protected snackbar: SnackbarModelInterface;
    private modelFactory: ModelFactory = ModelFactory.getInstance();

    public abstract execute(...args: any[]): void;

    public viewUpdate(_value: { [key: string]: any; }): void {
        this.dialog = <DialogModelInterface>this.modelFactory.get("DialogModel");
        this.snackbar = <SnackbarModelInterface>this.modelFactory.get("SnackbarModel");
    }
}

export default EpgrecModuleModel;


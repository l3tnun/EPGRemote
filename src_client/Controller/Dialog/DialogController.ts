"use strict";

import Controller from "../Controller";
import DialogViewModel from "../../ViewModel/Dialog/DialogViewModel";

/**
* Dialog Controller
* @param id dialog を一意に特定する id
* @throw DialogController option Error options が正しくない場合発生
*/
class DialogController extends Controller {
    private id: string;

    /**
    * @throw DialogController option Error options が正しくない場合発生
    */
    protected checkOptions(): void {
        if(!this.typeCheck("id", "string")) {
            console.log(this.options);
            throw new Error('DialogController option Error');
        }
        this.id = this.options["id"];
    }

    public initModel(): void {
        super.initModel();

        let dialogViewModel = <DialogViewModel>this.getModel("DialogViewModel");
        dialogViewModel.add(this.id);
    }
}

export default DialogController;


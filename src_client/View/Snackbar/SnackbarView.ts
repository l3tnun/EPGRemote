/// <reference path="../../../extendedTypings/MaterialSnackbar.d.ts" />
"use strict";

import * as m from 'mithril';
import { Vnode, VnodeDOM } from 'mithril';
import View from '../View';
import SnackbarViewModel from '../../ViewModel/Snackbar/SnackbarViewModel';

/**
* Snackbar View
*/
class SnackbarView extends View {
    private viewModel: SnackbarViewModel;

    public execute(): Vnode<any, any> {
        this.viewModel = <SnackbarViewModel>this.getModel("SnackbarViewModel");

        return m("div", {
                id: SnackbarViewModel.id,
                class: "mdl-js-snackbar mdl-snackbar",
                onupdate: (vnode: VnodeDOM<any, any>) => {
                    let message = this.viewModel.get();
                    if(message == null) { return; }
                    (<MaterialSnackbar>(vnode.dom)).MaterialSnackbar.showSnackbar({ message: message });
                }
            }, [
            m("div", { class: "mdl-snackbar__text" } ),
            m("button", { class: "mdl-snackbar__action", type: "button" } )
        ]);
    }
}

export default SnackbarView;


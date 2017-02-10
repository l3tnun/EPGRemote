"use strict";

import * as m from 'mithril';
import View from '../View';
import LiveProgramCardViewModel from '../../ViewModel/Live/LiveProgramCardViewModel';

/**
* LiveProgramAddTimeButton View
*/
class LiveProgramAddTimeButtonView extends View {
    private viewModel: LiveProgramCardViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <LiveProgramCardViewModel>this.getModel("LiveProgramCardViewModel");

        return m("div", {
            class: "live-program-add-time"
        },[
            m("button", {
                class: "live-program-add-time-now mdl-shadow--8dp mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent",
                onclick: () => {
                    this.viewModel.resetTimeUpdate();
                }
            }, "NOW"),
            m("button", {
                class: "mdl-shadow--8dp mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent",
                onclick: () => {
                    this.viewModel.addTimeUpdate(10);
                }
            }, "+10分")
        ]);
    }
}

export default LiveProgramAddTimeButtonView;


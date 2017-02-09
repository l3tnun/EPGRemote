"use strict";

import * as m from 'mithril';
import View from '../View';
import DiskDialogViewModel from '../../ViewModel/Disk/DiskDialogViewModel';

/**
* DiskDialog の View
*/
class DiskDialogView extends View {
    private viewModel: DiskDialogViewModel;

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <DiskDialogViewModel>this.getModel("DiskDialogViewModel");

        return m("div", [
            m("div", { class: "disk-dialog" }, [
                m("div", { class: "count" }, [
                    m("em", { class: "title1" }, "空き容量"),
                    m("em", { class: "title2" }, `${ this.viewModel.getAvailable() }GB`),
                ]),
                m("canvas", {
                    id: DiskDialogViewModel.chartId,
                    width: "200",
                    height: "200"
                })
            ])
        ]);
    }
}

export default DiskDialogView;


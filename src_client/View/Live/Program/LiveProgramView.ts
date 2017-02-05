"use strict";

import * as m from 'mithril';
import ParentPageView from '../../ParentPageView';
import LiveProgramCardComponent from '../../../Component/Live/LiveProgramCardComponent';
import DialogComponent from '../../../Component/Dialog/DialogComponent';
import LiveProgramDialogContentComponent from '../../../Component/Live/LiveProgramDialogContentComponent';
import LiveProgramAddTimeButtonComponent from '../../../Component/Live/LiveProgramAddTimeButtonComponent';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';

/**
* LiveProgram の View
*/
class LiveProgramView extends ParentPageView {
    public execute(): Mithril.VirtualElement {
        return m("div", { class: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, [
            this.createHeader("番組表"),
            this.createHeaderMenu(),
            this.createNavigation(),
            m(new LiveProgramAddTimeButtonComponent()),

            this.mainLayout([
                m(new LiveProgramCardComponent(), { single: false })
            ]),

            m(new DialogComponent(), {
                id: LiveProgramCardViewModel.dialogId,
                width: 650,
                content: m(new LiveProgramDialogContentComponent())
            }),

            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }
}

export default LiveProgramView;


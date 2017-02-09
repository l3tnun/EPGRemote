"use strict";

import * as m from 'mithril';
import ParentPageView from '../../ParentPageView';
import LiveProgramCardComponent from '../../../Component/Live/LiveProgramCardComponent';
import LiveProgramDialogContentComponent from '../../../Component/Live/LiveProgramDialogContentComponent';
import LiveProgramAddTimeButtonComponent from '../../../Component/Live/LiveProgramAddTimeButtonComponent';
import LiveProgramCardViewModel from '../../../ViewModel/Live/LiveProgramCardViewModel';

/**
* LiveProgram の View
*/
class LiveProgramView extends ParentPageView {
    private liveProgramCardComponent = new LiveProgramCardComponent();
    private liveProgramDialogContentComponent = new LiveProgramDialogContentComponent();
    private liveProgramAddTimeButtonComponent = new LiveProgramAddTimeButtonComponent();

    public execute(): Mithril.Vnode<any, any> {
        return m("div", { class: "mdl-layout mdl-js-layout mdl-layout--fixed-header"}, [
            this.createHeader("番組表"),
            this.createHeaderMenu(),
            this.createNavigation(),
            m(this.liveProgramAddTimeButtonComponent),

            this.mainLayout([
                m(this.liveProgramCardComponent, { single: false })
            ]),

            m(this.getDialogComponent(LiveProgramCardViewModel.dialogId), {
                id: LiveProgramCardViewModel.dialogId,
                width: 650,
                content: m(this.liveProgramDialogContentComponent)
            }),

            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }
}

export default LiveProgramView;


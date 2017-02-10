"use strict";

import * as m from 'mithril';
import ParentPageController from '../ParentPageController';
import ProgramViewModel from '../../ViewModel/Program/ProgramViewModel';

class ProgramController extends ParentPageController {
    private resizeListener = this.resize.bind(this);
    private viewModel: ProgramViewModel;
    private nowBarTimerId: number;

    //ViewModel 初期化
    public initModel(): void {
        super.initModel();

        this.viewModel = <ProgramViewModel>this.getModel("ProgramViewModel");
        this.viewModel.init();

        //時刻線の位置を定期的に更新
        setTimeout(() => { this.updateNowBarTimer(); }, 100);

        window.addEventListener('resize', this.resizeListener, false );
    }

    public enableSocketIoModules(): void {
        super.enableSocketIoModules();

        this.socketIoManager.enableModule("refreshTuner");
        this.socketIoManager.enableModule("programAutorec");
        this.socketIoManager.enableModule("programSimpleRec");
        this.socketIoManager.enableModule("programCancelaRec");
        this.socketIoManager.enableModule("programCustomRec");
        this.socketIoManager.enableModule("programOtherEvent");
        this.socketIoManager.enableModule("epgSingleUpdate");
    }

    //ページから離れるときに呼び出される
    public onRemove(): void {
        super.onRemove();
        clearInterval(this.nowBarTimerId);
        window.removeEventListener('resize', this.resizeListener, false );
    }

    //window resize
    private resize(): void {
        this.viewModel.resize();
    }

    //時刻線の位置を更新するたびに 1分毎に再描画させる
    private updateNowBarTimer(): void {
        this.nowBarTimerId = window.setTimeout(() => {
            m.redraw();
            this.updateNowBarTimer();
        }, (60 - new Date().getSeconds()) * 1000);
    }
}

export default ProgramController;


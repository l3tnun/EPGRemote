"use strict";

import Component from '../Component';
import LiveProgramCardController from '../../Controller/Live/LiveProgramCardController';
import LiveProgramCardView from '../../View/Live/LiveProgramCardView';

/**
* LiveProgramCard Component
* @param { single: boolean } の形式で単一カード表示か複数カード表示か変更できる
* single true: 単一カード表示, false: 複数カード表示
* @throw LiveProgramCardComponentOptionError コンストラクタの option の指定が間違えている場合に発生する
*/
class LiveProgramCardComponent extends Component {
    protected getController() {
        return new LiveProgramCardController();
    }

    protected getView() {
        return new LiveProgramCardView();
    }

    protected getModels() {
        return {
            LiveProgramCardViewModel: this.container.get("LiveProgramCardViewModel"),
            DialogViewModel: this.container.get("DialogViewModel"),
            LiveProgramDialogContentViewModel: this.container.get("LiveProgramDialogContentViewModel")
        }
    }
}

export default LiveProgramCardComponent;


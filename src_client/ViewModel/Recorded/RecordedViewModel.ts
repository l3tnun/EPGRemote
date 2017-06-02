"use strict";

import Util from '../../Util/Util';
import ViewModel from '../ViewModel';
import { RecordedApiModelParamsInterface, RecordedApiModelInterface} from '../../Model/Api/Recorded/RecordedApiModel';
import { ControllerStatus } from '../../Enums';

/**
* Recorded ViewModel
*/

class RecordedViewModel extends ViewModel {
    private recordedApiModel: RecordedApiModelInterface;
    private options: RecordedApiModelParamsInterface = {};

    constructor(_recordedApiModel: RecordedApiModelInterface) {
        super();
        this.recordedApiModel = _recordedApiModel;
    }

    public init(status: ControllerStatus): void {
        if(status != "reload") { this.recordedApiModel.init(); }
        setTimeout(() => {
            this.setup(Util.getCopyQuery());
            this.update();
        }, 200);
    }

    /**
    * パラメータ設定
    * @param options RecordedApiModelParamsInterface の形式で渡す
    */
    public setup(options: RecordedApiModelParamsInterface): void {
        this.options = options;
    }

    //更新
    public update(): void {
        this.recordedApiModel.setup(this.options);
        this.recordedApiModel.update();
    }

    public getRecordedList(): any[] {
        return this.recordedApiModel.getRecordedList();
    }

    public getRecordedTotalNum(): number {
        let value = this.recordedApiModel.getRecordedTotalNum();
        return value == null ? 0 : value;
    }

    public getRecordedLimit(): number {
        let value = this.recordedApiModel.getRecordedLimit();
        return value == null ? 0 : value;
    }
}

namespace RecordedViewModel {
    export const cardWidth = 308;
}

export default RecordedViewModel;


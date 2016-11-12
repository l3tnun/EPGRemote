"use strict";

import ViewModel from '../ViewModel';
import { DeleteVideoEpgrecModuleModelInterface } from '../../Model/Api/EpgrecModule/DeleteVideoEpgrecModuleModel';

/**
* RecordedDeleteVideo の ViewModel
*/
class RecordedDeleteVideoViewModel extends ViewModel {
    private deleteVideoEpgrecModule: DeleteVideoEpgrecModuleModelInterface;

    constructor(_deleteVideoEpgrecModule :DeleteVideoEpgrecModuleModelInterface) {
        super();
        this.deleteVideoEpgrecModule = _deleteVideoEpgrecModule;
    }

    //video の削除
    public deleteVideo(rec_id: number): void {
        this.deleteVideoEpgrecModule.execute(rec_id);
    }
}

export default RecordedDeleteVideoViewModel;


"use strict";

import ViewModel from '../ViewModel';

/**
* RecordedMenu の ViewModel
*/
class RecordedMenuViewModel extends ViewModel {
    public program: { [key: string]: any } | null = null;
}

namespace RecordedMenuViewModel {
    export const id = "menu-list";
    export const programInfoDialogId = "recorded_program_info_dialog";
    export const deleteVideoDialogId = "recorded_delete_video_dialog";
}

export default RecordedMenuViewModel;


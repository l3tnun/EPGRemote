"use strict";

import ViewModel from '../ViewModel';

/**
* LogPageActionDialog の ViewModel
*/
class LogPageActionDialogViewModel extends ViewModel {
    private link: { [key: string]: any } | null = null;

    public init(): void {
        this.link = null;
    }

    public setLink(value: { [key: string]: any }): void {
        this.link = value;
    }

    public getLink(): { [key: string]: any } | null {
        return this.link;
    }
}

export default LogPageActionDialogViewModel;


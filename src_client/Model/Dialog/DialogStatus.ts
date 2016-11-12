"use strict";

/**
* DialogStatus
* 表示、非表示の状態を保持する
*/
class DialogStatus {
    private status: boolean = false;

    public open(): void {
        this.status = true;
    }

    public close(): void {
        this.status = false;
    }

    public getStatus(): boolean {
        return this.status;
    }
}

export default DialogStatus;


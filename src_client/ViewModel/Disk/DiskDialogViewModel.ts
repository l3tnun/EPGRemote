"use strict";

import * as Chart from 'chart.js';
import ViewModel from '../ViewModel';
import { DiskApiModelInterface } from '../../Model/Api/Disk/DiskApiModel';

/**
* DiskDialog の ViewModel
*/
class DiskDialogViewModel extends ViewModel {
    private diskApiModel: DiskApiModelInterface;
    private chart: Chart | null = null;

    constructor(_diskApiModel: DiskApiModelInterface) {
        super();

        this.diskApiModel = _diskApiModel;
    }

    //更新
    public update(): void {
        if(this.chart != null) {
            try {
                this.chart.clear();
                this.chart.destroy();
            } catch(e) {
                /*
                console.log(e);
                console.log('chart destroy error');
                */
            }
        }
        this.diskApiModel.update(() => { this.show(); });
    }

    /**
    * disk の大きさを返す(GB)
    */
    public getSize(): number {
        return this.diskApiModel.getSize();
    }

    /**
    * disk の使用サイズを返す(GB)
    */
    public getUsed(): number {
        return this.diskApiModel.getUsed();
    }

    /**
    * disk の空き容量を返す(GB)
    */
    public getAvailable(): number {
        return this.diskApiModel.getAvailable();
    }

    public show(): void {
        let ctx = (<HTMLCanvasElement>document.getElementById(DiskDialogViewModel.chartId))!.getContext("2d")!;
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [this.getAvailable(), this.getUsed()],
                    backgroundColor: [
                        "#EF3C79",
                        "#FBCBDB"
                    ]
                }]
            }
        });
    }
}

namespace DiskDialogViewModel {
    export const dialogId = "disk_dialog";
    export const chartId = "disk_dialog_chart";
}

export default DiskDialogViewModel;


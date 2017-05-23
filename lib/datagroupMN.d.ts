import { DataGroupOptions } from './datagroup';
import DataGroup from './datagroup';
import { PlotType } from './plot';
export default class DataGroupMN extends DataGroup {
    private _data;
    private _lastdata;
    private _changed;
    private _plotType;
    private _m;
    private _c;
    constructor(width: number, height: number, options?: DataGroupOptions);
    from2DData(data: number[][], plotType: PlotType): void;
    private _genGridDom(data);
    private _computeTransform();
    private _findChangedCellsInLastChange();
    private _update();
}

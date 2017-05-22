import { DataGroupOptions } from './datagroup';
import DataGroup from './datagroup';
import { PlotType } from './plot';
export default class DataGroup1D extends DataGroup {
    private _dataArray;
    constructor(width: number, height: number, options?: DataGroupOptions);
    add(data: number[], plotType: PlotType): void;
    _computeTransform(): void;
    private _genLineDom(data, style?);
    private _genScatterDom(data, style?, radius?);
    private _genBarDom(data, style?, barwidth?);
    private _update();
}

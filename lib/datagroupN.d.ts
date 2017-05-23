import { DataGroupOptions } from './datagroup';
import DataGroup from './datagroup';
import { PlotType } from './plot';
/**
 * This DataGroup is for 1-dimensional data of length N
 * For e.g. values of a function at regular intervals
 */
export default class DataGroupN extends DataGroup {
    private _dataArray;
    constructor(width: number, height: number, options?: DataGroupOptions);
    add(data: number[], plotType: PlotType): void;
    _computeTransform(): void;
    private _genLineDom(data, style?);
    private _genScatterDom(data, style?, radius?);
    private _genBarDom(data, style?, barwidth?);
    private _update();
}

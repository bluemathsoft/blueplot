import { PlotType } from './plot';
import { DataGroupOptions } from './datagroup';
import DataGroup from './datagroup';
export default class DataGroup2D extends DataGroup {
    private _xSeriesGroup;
    private _ySeriesGroup;
    private xmin;
    private xmax;
    constructor(width: number, height: number, options?: DataGroupOptions);
    /**
     * @param points expected [[x0,y0],[x1,y1],...]
     * @param plotType
     */
    addPoints(points: number[][], plotType: PlotType): void;
    private _computeTransform();
    private _genLineDom(xdata, ydata, style?);
    private _genScatterDom(xdata, ydata, style?, radius?);
    private _genBarDom(xdata, ydata, style?, barwidth?);
    private _update();
}

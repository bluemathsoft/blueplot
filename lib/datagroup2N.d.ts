import { PlotType } from './plot';
import { DataGroupOptions } from './datagroup';
import DataGroup from './datagroup';
/**
 * This DataGroup is for 2-dimensional data with N-data points in each
 * dimension. For e.g. Points on plane
 */
export default class DataGroup2N extends DataGroup {
    private _xSeriesGroup;
    private _ySeriesGroup;
    private xmin;
    private xmax;
    constructor(width: number, height: number, options?: DataGroupOptions);
    /**
     * @param points expected [[x0,y0],[x1,y1],...]
     * @param plotType
     */
    fromPoints(points: number[][], plotType: PlotType): void;
    /**
     * @param xSeries expected [x0,x1,x2,...]
     * @param ySeries expected [y0,y1,y2,...]
     */
    fromSeries(xSeries: number[], ySeries: number[], plotType: PlotType): void;
    private _computeTransform();
    private _genLineDom(xdata, ydata, style?);
    private _genScatterDom(xdata, ydata, style?, radius?);
    private _genBarDom(xdata, ydata, style?, barwidth?);
    private _update();
}

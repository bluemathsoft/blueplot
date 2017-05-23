import Transform from './transform';
import { PlotType } from './plot';
declare const DEFAULT_STROKE_STYLE = "stroke:#000;fill:none";
declare const DEFAULT_FILL_STYLE = "stroke:none;fill:#000";
interface DataGroupOptions {
    axisDisplay?: 'visible' | 'hidden' | 'onhover';
    markerDisplay?: 'visible' | 'hidden' | 'onhover';
}
export { DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DataGroupOptions };
export default class DataGroup {
    protected _plotTypeArray: Array<PlotType>;
    dom: Element;
    guid: string;
    protected _transform: Transform;
    protected width: number;
    protected height: number;
    protected ymax: number;
    protected ymin: number;
    protected options: DataGroupOptions;
    constructor(width: number, height: number, options?: DataGroupOptions);
    protected _updateAxisDom(): void;
    protected _updateMarkerDom(): void;
}

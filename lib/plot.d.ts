import DataGroup from './datagroup';
interface PlotType {
    type: 'scatter' | 'line' | 'bar' | 'area' | 'grid';
    style?: string;
    radius?: number;
    barwidth?: number;
    timetrail?: boolean;
}
export default class Plot {
    dom: Element;
    width: number;
    height: number;
    private transform;
    private ymin;
    private ymax;
    private dgarr;
    constructor(width?: number, height?: number);
    add(dg: DataGroup): void;
}
export { PlotType };

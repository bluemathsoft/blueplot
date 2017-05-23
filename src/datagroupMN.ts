

import {DataGroupOptions} from './datagroup'
import DataGroup from './datagroup'
import {PlotType} from './plot'

const NS_SVG = 'http://www.w3.org/2000/svg';

export default class DataGroupMN extends DataGroup {

  private _data : number[][];
  private _plotType : PlotType;

  constructor(width:number, height:number, options?:DataGroupOptions) {
    super(width, height, options);
  }

  from2DData(data:number[][], plotType:PlotType) {
    this._data = data;
    this._plotType = plotType;
    this._update();
  }

  private _genGridDom(data:number[][]) : Element {
    let g = document.createElementNS(NS_SVG, 'g');

    let nrows = data.length;
    let ncols = 0;
    for(let i=0; i<data.length; i++) {
      ncols = Math.max(ncols, data[i].length);
    }

    let cellW = this.width/ncols;
    let cellH = this.height/nrows;
    let cellMargin = 3;

    for(let i=0; i<data.length; i++) {
      for(let j=0; j<data[i].length; j++) {
        let rect = document.createElementNS(NS_SVG,'rect');
        rect.setAttribute('width',(cellW-cellMargin/2)+'px');
        rect.setAttribute('height',(cellH-cellMargin/2)+'px');
        rect.setAttribute('x',(i*cellW+cellMargin/2)+'px');
        rect.setAttribute('y',(j*cellH+cellMargin/2)+'px');
        rect.setAttribute('style','fill:#f00;stroke:none');
        g.appendChild(rect);
      }
    }

    return g;
  }

  private _update() {
    let {style, radius, type, barwidth} = this._plotType;
    this._plotDom.splice(0);

    let g = this._genGridDom(this._data);
    this._plotDom.push(g);
  }
}
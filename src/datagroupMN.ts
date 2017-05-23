

import {DataGroupOptions} from './datagroup'
import DataGroup from './datagroup'
import {PlotType} from './plot'
import Kolor from './kolor'

const NS_SVG = 'http://www.w3.org/2000/svg';

function isInteger(value:number) {
  return typeof value === 'number' &&
    isFinite(value) &&
    Math.floor(value) === value;
}

export default class DataGroupMN extends DataGroup {

  private _data : number[][];
  private _lastdata : number[][];
  private _changed : number[][];
  private _plotType : PlotType;
  private _m : number;
  private _c : number;

  constructor(width:number, height:number, options?:DataGroupOptions) {
    super(width, height, options);
  }

  from2DData(data:number[][], plotType:PlotType) {
    if(this._data) {
      this._lastdata = JSON.parse(JSON.stringify(this._data));
    }
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
    let cellMargin = 8;
    let baseColor = new Kolor(1.0,0.2,0.0);

    let cellRects : Array<Array<Element>> = [];

    for(let i=0; i<data.length; i++) {
      cellRects[i] = [];
      for(let j=0; j<data[i].length; j++) {
        let v = data[i][j];
        let sat = this._m * v + this._c;
        let fillColor = baseColor.clone().setSaturation(sat);

        let rect = document.createElementNS(NS_SVG,'rect');
        rect.setAttribute('width',(cellW-cellMargin/2)+'px');
        rect.setAttribute('height',(cellH-cellMargin/2)+'px');
        rect.setAttribute('x',(j*cellW+cellMargin/2)+'px');
        rect.setAttribute('y',(i*cellH+cellMargin/2)+'px');
        rect.setAttribute('style','fill:'+fillColor.toCSSHex());

        let text = document.createElementNS(NS_SVG, 'text');
        text.setAttribute('x',(j*cellW+cellW/2)+'px');
        text.setAttribute('y',(i*cellH+cellH/2)+'px');
        if(isInteger(v)) {
          text.textContent = Math.round(v)+'';
        } else {
          text.textContent = v.toFixed(2);
        }

        cellRects[i].push(rect);

        g.appendChild(rect);
        g.appendChild(text);
      }
    }

    if(this._changed) {
      for(let [i,j] of this._changed) {
        let style = cellRects[i][j].getAttribute('style');
        style = style+';stroke:#000;stroke-width:2';
        cellRects[i][j].setAttribute('style',style);
      }
    }

    return g;
  }

  private _computeTransform() {

    let vmax = -Infinity;
    let vmin = Infinity;
    for(let i=0; i<this._data.length; i++) {
      for(let j=0; j<this._data[i].length; j++) {
        vmax = Math.max(vmax, this._data[i][j]);
        vmin = Math.min(vmin, this._data[i][j]);
      }
    }

    /*
    * vmin <=> Saturation=0
    * vmax <=> Saturation=1
    * =>
    * 0 = m*vmin + c
    * 1 = m*vmax + c
    * Solving,
    * m = 1/(vmax-vmin)
    * c = 1-vmax/(vmax-vmin)
    */
    let vspan = vmax-vmin;

    this._m = 1/vspan;
    this._c = 1-vmax/vspan;
  }

  private _findChangedCellsInLastChange() {
    if(!this._lastdata) {
      return;
    }
    this._changed = [];
    for(let i=0; i<this._data.length; i++) {
      for(let j=0; j<this._data[i].length; j++) {
        if(this._lastdata[i][j] !== this._data[i][j]) {
          this._changed.push([i,j]);
        }
      }
    }
  }

  private _update() {
    this._computeTransform();
    let {style, radius, type, barwidth, timetrail} = this._plotType;
    if(timetrail) {
      this._findChangedCellsInLastChange();
    }

    let plotContentElems = this.dom.querySelectorAll('.plot-content');
    for(let i=0; i<plotContentElems.length; i++) {
      plotContentElems[i].remove();
    }

    this.dom.appendChild(this._genGridDom(this._data));
  }
}
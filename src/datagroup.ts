 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of blueplot.

 blueplot is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 blueplot is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with blueplot. If not, see <http://www.gnu.org/licenses/>.

*/

const NS_SVG = 'http://www.w3.org/2000/svg';

import Transform from './transform'

type OneDArray = Array<number>;
type TwoDArray = Array<Array<number>>;

import {PlotType} from './plot'

const DEFAULT_STROKE_STYLE = 'stroke:#000;fill:none';
const DEFAULT_FILL_STYLE = 'stroke:none;fill:#000';

interface DataGroupOptions {
  axisDisplay? : 'visible'|'hidden'|'onhover';
  markerDisplay? : 'visible'|'hidden'|'onhover';
}

export {
  DEFAULT_FILL_STYLE,
  DEFAULT_STROKE_STYLE,
  DataGroupOptions
}

export default class DataGroup {
  protected _plotTypeArray : Array<PlotType>;

  protected _plotDom : Array<Element>;
  protected _axisDom : Array<Element>;
  protected _markerDom : Array<Element>;
  protected _transform : Transform;
  protected width : number;
  protected height : number;
  protected ymax : number;
  protected ymin : number;
  protected options : DataGroupOptions;

  constructor(width:number, height:number, options?:DataGroupOptions) {
    this.width = width;
    this.height = height;
    this.options = options || {};
    this._plotTypeArray = [];
    this._plotDom = [];
    this._axisDom = [];
    this._markerDom = [];
  }

  get domArr() : Array<Element> {
    let arr : Array<Element> = [];
    arr = arr.concat(this._plotDom);
    arr = arr.concat(this._axisDom);
    arr = arr.concat(this._markerDom);
    return arr;
  }

  protected _updateAxisDom() {
    this._axisDom.splice(0);
    let transform = this._transform;
    let tymax = transform.transformPoint([0,this.ymax])[1];
    let tymin = transform.transformPoint([0,this.ymin])[1];
    // Add ymax label
    let ymaxLabel = document.createElementNS(NS_SVG, 'text');
    ymaxLabel.textContent = this.ymax+'';
    let ymaxRightPadding = ymaxLabel.textContent.length * 10; // guestimate
    ymaxLabel.setAttribute('x', (this.width-ymaxRightPadding)+'px');
    ymaxLabel.setAttribute('y', (tymax-5)+'px');
    this._axisDom.push(ymaxLabel);

    // Add ymin label
    let yminLabel = document.createElementNS(NS_SVG, 'text');
    yminLabel.textContent = this.ymin+'';
    let yminRightPadding = yminLabel.textContent.length * 10; // guestimate
    yminLabel.setAttribute('x', (this.width-yminRightPadding)+'px');
    yminLabel.setAttribute('y', (tymin-5)+'px');
    this._axisDom.push(yminLabel);

  }

  protected _updateMarkerDom() {
    this._markerDom.splice(0);
    let transform = this._transform;
    // Add ymax line
    let ymaxLine = document.createElementNS(NS_SVG, 'line');
    let tymax = transform.transformPoint([0,this.ymax])[1];
    ymaxLine.setAttribute('id','ymax');
    ymaxLine.setAttribute('x1','0');
    ymaxLine.setAttribute('y1',tymax+'px');
    ymaxLine.setAttribute('x2',this.width+'px');
    ymaxLine.setAttribute('y2',tymax+'px');
    ymaxLine.setAttribute('style','stroke:#888;fill:none;stroke-dasharray:4,5');
    this._markerDom.push(ymaxLine);

    // Add ymin line
    let yminLine = document.createElementNS(NS_SVG, 'line');
    let tymin = transform.transformPoint([0,this.ymin])[1];
    yminLine.setAttribute('id','ymin');
    yminLine.setAttribute('x1','0');
    yminLine.setAttribute('y1',tymin+'px');
    yminLine.setAttribute('x2',this.width+'px');
    yminLine.setAttribute('y2',tymin+'px');
    yminLine.setAttribute('style','stroke:#888;fill:none;stroke-dasharray:4,5');
    this._markerDom.push(yminLine);

    if(this.ymin < 0 && this.ymax > 0) {
      // Add zero marker
      let zeroLine = document.createElementNS(NS_SVG, 'line');
      let tzero = transform.transformPoint([0,0])[1];
      zeroLine.setAttribute('id','zero');
      zeroLine.setAttribute('x1','0');
      zeroLine.setAttribute('y1',tzero+'px');
      zeroLine.setAttribute('x2',this.width+'px');
      zeroLine.setAttribute('y2',tzero+'px');
      zeroLine.setAttribute('style','stroke:#ccc;fill:none;stroke-dasharray:4,5');
      this._markerDom.push(zeroLine);
    }
  }

}


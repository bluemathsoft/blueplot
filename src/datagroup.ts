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
type PlotType = 'scatter' | 'line' | 'bar' | 'area';

export default class DataGroup {

  private _dataArray : Array<any>;
  private _plotTypeArray : Array<PlotType>;

  private _plotDom : Array<Element>;
  private _transform : Transform;
  private width : number;
  private height : number;

  constructor(width:number, height:number) {
    this.width = width;
    this.height = height;
    this._dataArray = [];
    this._plotTypeArray = [];
    this._plotDom = [];
  }

  add(data : OneDArray|TwoDArray, plotType:PlotType) {
    if(this._dataArray.length > 1) {
      let curDataSample = this._dataArray[0];
      if(
        // Current data in dataArray is TwoDArray, but newly added data is not
        (Array.isArray(data[0]) && !Array.isArray(curDataSample[0])) ||
        // Current data in dataArray is OneDArray, but newly added data is not
        (!Array.isArray(data[0]) && Array.isArray(curDataSample[0]))
      )
      {
        throw new Error('New data dimensions do not match with existing data');
      }
    }
    this._dataArray.push(data);
    this._plotTypeArray.push(plotType);
    this._update();
  }

  _computeTransform() {
    let data:Array<any> = [];
    for(let d of this._dataArray) {
      data = data.concat(d);
    }

    let ymin = Math.min(...data);
    let ymax = Math.max(...data);
    let xmin = 0;
    let xmax = data.length;

    // this.ymin = ymin;
    // this.ymax = ymax;

    let ymid = (ymin+ymax)/2;

    let xspan = xmax-xmin;

    let xscale = 0.8 * this.width / xspan;

    /*
    * 0.1 * H <=> m * ymax + c
    * 0.5 * H <=> m * ymid + c
    * 0.9 * H <=> m * ymin + c
    *
    * The Y-transform eqn is: ty = m * y + c
    *
    * Solving, we get 
    *   m = 0.4*H/(ymin-ymid)
    *   c = 0.9*H - m*ymin
    * In Transform form, m is scale and c is translation of y
    */

    let m = 0.4*this.height/(ymin-ymid);
    let c = 0.9*this.height - m*ymin;

    // SVG Y-axis increases down, a math user will expect the reverse
    this._transform = new Transform();
    this._transform.setTranslation(0.1*this.width, c);
    this._transform.setScale(xscale, m);

  }

  private _genLineDom(data:OneDArray) : Element {
    let polyline = document.createElementNS(NS_SVG, 'polyline');
    let coordStrings = data.map(
      (y,i) => this._transform.transformPoint([i,y]).join(','));
    polyline.setAttribute('points', coordStrings.join(' '));
    polyline.setAttribute('style', 'stroke:#000;fill:none' );
    return polyline;
  }

  private _update() {
    this._computeTransform();

    this._plotDom.splice(0);
    for(let i=0; i<this._dataArray.length; i++) {
      let data = this._dataArray[i];
      let plotType = this._plotTypeArray[i];

      switch(plotType) {
        case 'line':
          this._plotDom.push(this._genLineDom(data));
          break;
        case 'scatter':
          break;
        case 'bar':
          break;
        case 'area':
          break;
      }

    }
  }

  get plotDom() : Array<Element> {
    return this._plotDom;
  }
}
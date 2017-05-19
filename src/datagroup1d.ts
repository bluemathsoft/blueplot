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

import {
  DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DataGroupOptions
} from './datagroup'
import DataGroup from './datagroup'
import {PlotType} from './plot'
import Transform from './transform'

const NS_SVG = 'http://www.w3.org/2000/svg';
export default class DataGroup1D extends DataGroup {

  private _dataArray : Array<number[]>;

  constructor(width:number, height:number, options?:DataGroupOptions) {
    super(width, height, options);
    this._dataArray = [];
  }

  add(data : number[], plotType:PlotType) {
    this._dataArray.push(data);
    this._plotTypeArray.push(plotType);
    this._update();
  }

  _computeTransform() {
    let data:Array<number> = [];

    let xmin = 0;
    let xmax = 0;
    for(let d of this._dataArray) {
      data = data.concat(d);
      xmax = Math.max(xmax, d.length);
    }

    let ymin = Math.min(...data);
    let ymax = Math.max(...data);

    this.ymin = ymin;
    this.ymax = ymax;

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

  private _genLineDom(data:number[], style?:string) : Element {
    let polyline = document.createElementNS(NS_SVG, 'polyline');
    let coordStrings = data.map(
      (y,i) => this._transform.transformPoint([i,y]).join(','));
    polyline.setAttribute('points', coordStrings.join(' '));
    polyline.setAttribute('style', style||DEFAULT_STROKE_STYLE);
    return polyline;
  }

  private _genScatterDom(data:number[], style?:string, radius?:number) : Array<Element> {
    let domArr:Array<Element> = [];
    data.forEach((y,i) => {
      let [cx,cy] = this._transform.transformPoint([i,y]);
      let dot = document.createElementNS(NS_SVG, 'circle');
      dot.setAttribute('cx', cx+'px');
      dot.setAttribute('cy', cy+'px');
      dot.setAttribute('r', (radius||2)+'px');
      dot.setAttribute('style', style||DEFAULT_FILL_STYLE);
      domArr.push(dot);
    });
    return domArr;
  }

  private _genBarDom(data:number[], style?:string, barwidth?:number) :
    Array<Element>
  {
    let domArr:Array<Element> = [];
    let barWidth = barwidth||8;
    data.forEach((y,i) => {
      let [xt,yt] = this._transform.transformPoint([i,y]);
      let [,yb] = this._transform.transformPoint([i,0]);
      let yval = yb-yt;
      let ypos;
      if(yval < 0) {
        ypos = yb;
      } else {
        ypos = yt;
      }
      let bar = document.createElementNS(NS_SVG, 'rect');
      bar.setAttribute('x', (xt-barWidth/2)+'px');
      bar.setAttribute('y', ypos+'px');
      bar.setAttribute('width', barWidth+'px');
      bar.setAttribute('height', Math.abs(yval)+'px');
      bar.setAttribute('style', style||DEFAULT_FILL_STYLE);
      domArr.push(bar);
    });
    return domArr;
  }

  private _update() {
    this._computeTransform();

    this._plotDom.splice(0); // Flush current plot doms
    for(let i=0; i<this._dataArray.length; i++) {
      let data = this._dataArray[i];
      let plotType = this._plotTypeArray[i];

      let {type,style,radius,barwidth} = plotType;

      switch(type) {
        case 'line':
          this._plotDom.push(
            this._genLineDom(data, style));
          break;
        case 'scatter':
          this._plotDom = this._plotDom.concat(
            this._genScatterDom(data, style, radius));
          break;
        case 'bar':
          this._plotDom = this._plotDom.concat(
            this._genBarDom(data, style, barwidth));
          break;
        case 'area':
          break;
      }
    }
    let axisDisplay = this.options.axisDisplay || 'visible';
    if(axisDisplay === 'visible') {
      this._updateAxisDom();
    }
    let markerDisplay = this.options.markerDisplay || 'visible';
    if(markerDisplay === 'visible') {
      this._updateMarkerDom();
    }
  }

}
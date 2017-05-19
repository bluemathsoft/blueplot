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

import {PlotType} from './plot'
import {
  DEFAULT_FILL_STYLE, DEFAULT_STROKE_STYLE, DataGroupOptions
} from './datagroup'
import DataGroup from './datagroup'
import Transform from './transform'

export default class DataGroup2D extends DataGroup {

  private _xSeriesGroup : Array<number[]>;
  private _ySeriesGroup : Array<number[]>;

  private xmin : number;
  private xmax : number;

  constructor(width:number, height:number, options?:DataGroupOptions) {
    super(width, height, options);
    this._xSeriesGroup = [];
    this._ySeriesGroup = [];
  }

  /**
   * @param points expected [[x0,y0],[x1,y1],...]
   * @param plotType 
   */
  addPoints(points:number[][], plotType:PlotType) {
    this._plotTypeArray.push(plotType);
    let xSeries = [];
    let ySeries = [];
    for(let point of points) {
      xSeries.push(point[0]);
      ySeries.push(point[1]);
    }
    this._xSeriesGroup.push(xSeries);
    this._ySeriesGroup.push(ySeries);

    this._update();
  }

  private _computeTransform() {

    /*
    * For Y-dimension
    * 0.1 * H <=> my * ymax + cy
    * 0.5 * H <=> my * ymid + cy
    * 0.9 * H <=> my * ymin + cy
    *
    * The Y-transform eqn is: ty = my * y + cy
    *
    * Solving, we get 
    *   my = 0.4*H/(ymin-ymid)
    *   cy = 0.9*H - my * ymin
    * In Transform form, m is scale and c is translation of y
    *
    * For X-dimension
    * 0.1 * W <=> mx * xmin + cx
    * 0.5 * W <=> mx * xmid + cx
    * 0.9 * W <=> mx * xmax + cx
    *
    * The X-transform eqn is: yx = mx * x + cx
    *
    * Solving, we get
    *   mx = 0.4 * W / (xmax-xmid);
    *   cx = 0.9 * W - mx * xmax;
    */

    this.xmin = Infinity;
    this.xmax = -Infinity;
    this.ymin = Infinity;
    this.ymax = -Infinity;
    for(let xseries of this._xSeriesGroup) {
      this.xmin = Math.min(this.xmin, ...xseries);
      this.xmax = Math.max(this.xmax, ...xseries);
    }
    for(let yseries of this._ySeriesGroup) {
      this.ymin = Math.min(this.ymin, ...yseries);
      this.ymax = Math.max(this.ymax, ...yseries);
    }
    let xspan = this.xmax-this.xmin;
    let yspan = this.ymax-this.ymin;

    let xmid = (this.xmin+this.xmax)/2;
    let ymid = (this.ymin+this.ymax)/2;

    let mx = 0.4*this.width/(this.xmax-xmid);
    let cx = 0.9*this.width - mx*this.xmax;

    let my = 0.4*this.height/(this.ymin-ymid);
    let cy = 0.9*this.height - my*this.ymin;

    this._transform = new Transform();
    this._transform.setTranslation(cx,cy);
    this._transform.setScale(mx,my);
  }

  private _genLineDom(
    xdata:number[], ydata:number[], style?:string) : Element
  {
    let polyline = document.createElementNS(NS_SVG, 'polyline');
    console.assert(xdata.length === ydata.length);
    let coordStrings = [];
    for(let i=0; i<xdata.length; i++) {
      let x = xdata[i];
      let y = ydata[i];
      let [tx,ty] = this._transform.transformPoint([x,y]);
      coordStrings.push(`${tx},${ty}`);
    }
    polyline.setAttribute('points', coordStrings.join(' '));
    polyline.setAttribute('style', style||DEFAULT_STROKE_STYLE);
    return polyline;
  }

  private _genScatterDom(
    xdata:number[], ydata:number[], style?:string, radius?:number) :
    Array<Element>
  {
    let domArr:Array<Element> = [];
    console.assert(xdata.length === ydata.length);
    for(let i=0; i<xdata.length; i++) {
      let x = xdata[i];
      let y = ydata[i];
      let [tx,ty] = this._transform.transformPoint([x,y]);
      let dot = document.createElementNS(NS_SVG, 'circle');
      dot.setAttribute('cx',tx+'px');
      dot.setAttribute('cy',ty+'px');
      dot.setAttribute('r',(radius||2)+'px');
      dot.setAttribute('style',style||DEFAULT_FILL_STYLE);
      domArr.push(dot);
    }
    return domArr;
  }

  private _genBarDom(
    xdata:number[], ydata:number[], style?:string, barwidth?:number):
    Array<Element>
  {
    let domArr:Array<Element> = [];
    let barWidth = barwidth || 8;
    console.assert(xdata.length === ydata.length);
    for(let i=0; i<xdata.length; i++) {
      let x = xdata[i];
      let y = ydata[i];
      let [tx,ty] = this._transform.transformPoint([x,y]);
      let [,yb] = this._transform.transformPoint([x,0]);
      let yval = yb-ty;
      let ypos;
      if(yval < 0) {
        ypos = yb;
      } else {
        ypos = ty;
      }
      let bar = document.createElementNS(NS_SVG, 'rect');
      bar.setAttribute('x', (tx-barWidth/2)+'px');
      bar.setAttribute('y', ypos+'px');
      bar.setAttribute('width', barWidth+'px');
      bar.setAttribute('height',Math.abs(yval)+'px');
      bar.setAttribute('style', style||DEFAULT_FILL_STYLE);
      domArr.push(bar);
    }
    return domArr;
  }

  private _update() {
    this._computeTransform();

    this._plotDom.splice(0); // Flush current plot doms
    console.assert(this._xSeriesGroup.length === this._ySeriesGroup.length);
    for(let i=0; i<this._xSeriesGroup.length; i++) {
      let xseries = this._xSeriesGroup[i];
      let yseries = this._ySeriesGroup[i];
      let plotType = this._plotTypeArray[i];

      let {style, radius, type, barwidth} = plotType;

      switch(type) {
        case 'line':
          this._plotDom.push(this._genLineDom(
            xseries, yseries, style));
          break;
        case 'scatter':
          this._plotDom = this._plotDom.concat(this._genScatterDom(
            xseries, yseries, style, radius));
          break;
        case 'bar':
          this._plotDom = this._plotDom.concat(this._genBarDom(
            xseries, yseries, style, barwidth));
          break;
        case 'area':
          break;
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
}
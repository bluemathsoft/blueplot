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

export class DataGroup {
  protected _plotTypeArray : Array<PlotType>;

  protected _plotDom : Array<Element>;
  protected _axisDom : Array<Element>;
  protected _markerDom : Array<Element>;
  protected _transform : Transform;
  protected width : number;
  protected height : number;
  protected ymax : number;
  protected ymin : number;

  constructor(width:number, height:number) {
    this.width = width;
    this.height = height;
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
}

export class DataGroup1D extends DataGroup {

  private _dataArray : Array<OneDArray>;

  constructor(width:number, height:number) {
    super(width, height);
    this._dataArray = [];
  }

  add(data : OneDArray, plotType:PlotType) {
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

  private _genLineDom(data:OneDArray) : Element {
    let polyline = document.createElementNS(NS_SVG, 'polyline');
    let coordStrings = data.map(
      (y,i) => this._transform.transformPoint([i,y]).join(','));
    polyline.setAttribute('points', coordStrings.join(' '));
    polyline.setAttribute('style', 'stroke:#000;fill:none' );
    return polyline;
  }

  private _genScatterDom(data:OneDArray) : Array<Element> {
    let domArr:Array<Element> = [];
    data.forEach((y,i) => {
      let [cx,cy] = this._transform.transformPoint([i,y]);
      let dot = document.createElementNS(NS_SVG, 'circle');
      dot.setAttribute('cx', cx+'px');
      dot.setAttribute('cy', cy+'px');
      dot.setAttribute('r', '2px');
      domArr.push(dot);
    });
    return domArr;
  }

  private _genBarDom(data:OneDArray) : Array<Element> {
    let domArr:Array<Element> = [];
    let barWidth = 8;
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
      domArr.push(bar);
    });
    return domArr;
  }

  private _updateAxisDom() {
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

  private _updateMarkerDom() {
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

  private _update() {
    this._computeTransform();

    this._plotDom.splice(0); // Flush current plot doms
    for(let i=0; i<this._dataArray.length; i++) {
      let data = this._dataArray[i];
      let plotType = this._plotTypeArray[i];

      switch(plotType) {
        case 'line':
          this._plotDom.push(this._genLineDom(data));
          break;
        case 'scatter':
          this._plotDom = this._plotDom.concat(this._genScatterDom(data));
          break;
        case 'bar':
          this._plotDom = this._plotDom.concat(this._genBarDom(data));
          break;
        case 'area':
          break;
      }
    }
    this._updateAxisDom();
    this._updateMarkerDom();
  }

}

export class DataGroup2D extends DataGroup {

  private _xSeriesGroup : Array<OneDArray>;
  private _ySeriesGroup : Array<OneDArray>;

  private xmin : number;
  private xmax : number;

  constructor(width:number, height:number) {
    super(width, height);
    this._xSeriesGroup = [];
    this._ySeriesGroup = [];
  }

  /**
   * @param points expected [[x0,y0],[x1,y1],...]
   * @param plotType 
   */
  addPoints(points:TwoDArray, plotType:PlotType) {
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

  private _genLineDom(xdata:OneDArray, ydata:OneDArray) : Element {
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
    polyline.setAttribute('style', 'stroke:#000;fill:none');
    return polyline;
  }

  private _update() {
    this._computeTransform();

    this._plotDom.splice(0); // Flush current plot doms
    console.assert(this._xSeriesGroup.length === this._ySeriesGroup.length);
    for(let i=0; i<this._xSeriesGroup.length; i++) {
      let xseries = this._xSeriesGroup[i];
      let yseries = this._ySeriesGroup[i];
      let plotType = this._plotTypeArray[i];

      switch(plotType) {
        case 'line':
          this._plotDom.push(this._genLineDom(xseries, yseries));
          break;
      }

    }
  }
}
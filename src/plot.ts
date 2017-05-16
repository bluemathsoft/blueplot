
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

interface PlotOptions {
  type? : PlotType;
  dimension? : number;
}


export default class Plot {

  dom : Element;
  width : number;
  height : number;

  private transform : Transform;
  private ymin : number;
  private ymax : number;

  constructor(width=400,height=300) {
    this.width = width;
    this.height = height;
    this.dom = document.createElementNS(NS_SVG, 'svg');
    this.dom.setAttribute('width', this.width+'px');
    this.dom.setAttribute('height', this.height+'px');
  }

  private _defineDataTransformFor1DData(data:OneDArray) {
    let ymin = Math.min(...data);
    let ymax = Math.max(...data);
    let xmin = 0;
    let xmax = data.length;

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
    this.transform = new Transform();
    this.transform.setTranslation(0.1*this.width, c);
    this.transform.setScale(xscale, m);

  }


  add(data:OneDArray|TwoDArray, options?:PlotOptions) {
    if(!options) {
      options = {};
    }
    if(!Array.isArray(data[0])) { // 1-D array
      // Data is expected to be in format
      // [y0,y1,y2,...]
      // The x-coordinates are deduced from number of data points
      let type = options.type || 'line';

      let darr = <Array<number>>data;
      this._defineDataTransformFor1DData(darr);

      if(type === 'line') {
        let polyline = document.createElementNS(NS_SVG, 'polyline');
        let coordStrings = darr.map(
          (y,i) => this.transform.transformPoint([i,y]).join(','));
        polyline.setAttribute('points', coordStrings.join(' '));
        polyline.setAttribute('style', 'stroke:#000;fill:none' );
        this.dom.appendChild(polyline);
      } else if(type === 'scatter') {
        darr.forEach((y,i) => {
          let [cx,cy] = this.transform.transformPoint([i,y]);
          let dot = document.createElementNS(NS_SVG, 'circle');
          dot.setAttribute('cx', cx+'px');
          dot.setAttribute('cy', cy+'px');
          dot.setAttribute('r', '2px');
          this.dom.appendChild(dot);
        });
      } else if(type === 'bar') {
        let barWidth = 8;
        darr.forEach((y,i) => {
          let [xt,yt] = this.transform.transformPoint([i,y]);
          let [,yb] = this.transform.transformPoint([i,0]);
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
          this.dom.appendChild(bar);
        });

      }

      // Add ymax line
      let ymaxLine = document.createElementNS(NS_SVG, 'line');
      let tymax = this.transform.transformPoint([0,this.ymax])[1];
      ymaxLine.setAttribute('id','ymax');
      ymaxLine.setAttribute('x1','0');
      ymaxLine.setAttribute('y1',tymax+'px');
      ymaxLine.setAttribute('x2',this.width+'px');
      ymaxLine.setAttribute('y2',tymax+'px');
      ymaxLine.setAttribute('style','stroke:#888;fill:none;stroke-dasharray:4,5');
      this.dom.appendChild(ymaxLine);

      // Add ymin line
      let yminLine = document.createElementNS(NS_SVG, 'line');
      let tymin = this.transform.transformPoint([0,this.ymin])[1];
      yminLine.setAttribute('id','ymin');
      yminLine.setAttribute('x1','0');
      yminLine.setAttribute('y1',tymin+'px');
      yminLine.setAttribute('x2',this.width+'px');
      yminLine.setAttribute('y2',tymin+'px');
      yminLine.setAttribute('style','stroke:#888;fill:none;stroke-dasharray:4,5');
      this.dom.appendChild(yminLine);

      // Add ymax label
      let ymaxLabel = document.createElementNS(NS_SVG, 'text');
      ymaxLabel.textContent = this.ymax+'';
      ymaxLabel.setAttribute('x', (this.width-20)+'px');
      ymaxLabel.setAttribute('y', (tymax-5)+'px');
      this.dom.appendChild(ymaxLabel);

      // Add ymin label
      let yminLabel = document.createElementNS(NS_SVG, 'text');
      yminLabel.textContent = this.ymin+'';
      yminLabel.setAttribute('x', (this.width-20)+'px');
      yminLabel.setAttribute('y', (tymin-5)+'px');
      this.dom.appendChild(yminLabel);

    } else {
      let firstElem:Array<number> = <Array<number>> data[0];
      if(firstElem.length === 2) {
        // Data is expected to be in format
        // [[x0,y0],[x1,y1],[x2,y2],...]
      } else if(firstElem.length === 3) {
        // Data is expected to be in format
        // [[x0,y0,z0],[x1,y1,z1],[x2,y2,z2],...]
      }
    } 
  }
}

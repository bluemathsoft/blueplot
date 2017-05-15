
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

    let xscale = 0.8 * this.width / (xmax-xmin);
    let yscale = 0.8 * this.height / (ymax-ymin);

    // SVG Y-axis increases down, a math user will expect the reverse
    let transform = new Transform();
    transform.setTranslation(0.1*this.width, 0.9*this.height);
    transform.setScale(xscale, -yscale);
    return transform;
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
      let xform = this._defineDataTransformFor1DData(darr);

      if(type === 'line') {
        let polyline = document.createElementNS(NS_SVG, 'polyline');
        let coordStrings = darr.map(
          (y,i) => xform.transformPoint([i,y]).join(','));
        polyline.setAttribute('points', coordStrings.join(' '));
        polyline.setAttribute('style', 'stroke:#000;fill:none' );
        this.dom.appendChild(polyline);
      } else if(type === 'scatter') {
        darr.forEach((y,i) => {
          let [cx,cy] = xform.transformPoint([i,y]);
          let dot = document.createElementNS(NS_SVG, 'circle');
          dot.setAttribute('cx', cx+'px');
          dot.setAttribute('cy', cy+'px');
          dot.setAttribute('r', '2px');
          this.dom.appendChild(dot);
        });
      } else if(type === 'bar') {
        let barWidth = 8;
        darr.forEach((y,i) => {
          let [xt,yt] = xform.transformPoint([i,y]);
          let bar = document.createElementNS(NS_SVG, 'rect');
          bar.setAttribute('x', (xt-barWidth/2)+'px');
          bar.setAttribute('y', yt+'px');
          bar.setAttribute('width', barWidth+'px');
          bar.setAttribute('height', yt+'px');
          this.dom.appendChild(bar);
        });

      }

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

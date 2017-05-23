
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

import DataGroup from './datagroup'

import Transform from './transform'

type OneDArray = Array<number>;
type TwoDArray = Array<Array<number>>;

interface PlotType {
  type :'scatter' | 'line' | 'bar' | 'area' | 'grid';
  style? : string;
  radius? : number; // For scatter plots
  barwidth? : number; // For bar plots
};


export default class Plot {

  dom : Element;
  width : number;
  height : number;

  private transform : Transform;
  private ymin : number;
  private ymax : number;
  private dgarr : Array<DataGroup>;

  constructor(width=400,height=300) {
    this.width = width;
    this.height = height;
    this.dom = document.createElementNS(NS_SVG, 'svg');
    this.dom.setAttribute('width', this.width+'px');
    this.dom.setAttribute('height', this.height+'px');
    this.dgarr = [];
  }

  add(dg : DataGroup) {
    this.dgarr.push(dg);
  }

  render() {
    // Remove all content of the plot
    while(this.dom.children.length > 0) {
      this.dom.children[0].remove();
    }
    for(let dg of this.dgarr) {
      for(let dom of dg.domArr) {
        this.dom.appendChild(dom);
      }
    }
  }

}

export {
  PlotType
}
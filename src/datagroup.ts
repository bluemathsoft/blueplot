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

export {
  DEFAULT_FILL_STYLE,
  DEFAULT_STROKE_STYLE
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


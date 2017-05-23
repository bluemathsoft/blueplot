"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var NS_SVG = 'http://www.w3.org/2000/svg';
;
var Plot = (function () {
    function Plot(width, height) {
        if (width === void 0) { width = 400; }
        if (height === void 0) { height = 300; }
        this.width = width;
        this.height = height;
        this.dom = document.createElementNS(NS_SVG, 'svg');
        this.dom.setAttribute('width', this.width + 'px');
        this.dom.setAttribute('height', this.height + 'px');
        this.dgarr = [];
    }
    Plot.prototype.add = function (dg) {
        this.dom.appendChild(dg.dom);
    };
    return Plot;
}());
exports.default = Plot;

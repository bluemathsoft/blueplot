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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var datagroup_1 = require("./datagroup");
var datagroup_2 = require("./datagroup");
var transform_1 = require("./transform");
var NS_SVG = 'http://www.w3.org/2000/svg';
var DataGroup1D = (function (_super) {
    __extends(DataGroup1D, _super);
    function DataGroup1D(width, height, options) {
        var _this = _super.call(this, width, height, options) || this;
        _this._dataArray = [];
        return _this;
    }
    DataGroup1D.prototype.add = function (data, plotType) {
        this._dataArray.push(data);
        this._plotTypeArray.push(plotType);
        this._update();
    };
    DataGroup1D.prototype._computeTransform = function () {
        var data = [];
        var xmin = 0;
        var xmax = 0;
        for (var _i = 0, _a = this._dataArray; _i < _a.length; _i++) {
            var d = _a[_i];
            data = data.concat(d);
            xmax = Math.max(xmax, d.length);
        }
        var ymin = Math.min.apply(Math, data);
        var ymax = Math.max.apply(Math, data);
        this.ymin = ymin;
        this.ymax = ymax;
        var ymid = (ymin + ymax) / 2;
        var xspan = xmax - xmin;
        var xscale = 0.8 * this.width / xspan;
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
        var m = 0.4 * this.height / (ymin - ymid);
        var c = 0.9 * this.height - m * ymin;
        // SVG Y-axis increases down, a math user will expect the reverse
        this._transform = new transform_1.default();
        this._transform.setTranslation(0.1 * this.width, c);
        this._transform.setScale(xscale, m);
    };
    DataGroup1D.prototype._genLineDom = function (data, style) {
        var _this = this;
        var polyline = document.createElementNS(NS_SVG, 'polyline');
        var coordStrings = data.map(function (y, i) { return _this._transform.transformPoint([i, y]).join(','); });
        polyline.setAttribute('points', coordStrings.join(' '));
        polyline.setAttribute('style', style || datagroup_1.DEFAULT_STROKE_STYLE);
        return polyline;
    };
    DataGroup1D.prototype._genScatterDom = function (data, style, radius) {
        var _this = this;
        var domArr = [];
        data.forEach(function (y, i) {
            var _a = _this._transform.transformPoint([i, y]), cx = _a[0], cy = _a[1];
            var dot = document.createElementNS(NS_SVG, 'circle');
            dot.setAttribute('cx', cx + 'px');
            dot.setAttribute('cy', cy + 'px');
            dot.setAttribute('r', (radius || 2) + 'px');
            dot.setAttribute('style', style || datagroup_1.DEFAULT_FILL_STYLE);
            domArr.push(dot);
        });
        return domArr;
    };
    DataGroup1D.prototype._genBarDom = function (data, style, barwidth) {
        var _this = this;
        var domArr = [];
        var barWidth = barwidth || 8;
        data.forEach(function (y, i) {
            var _a = _this._transform.transformPoint([i, y]), xt = _a[0], yt = _a[1];
            var _b = _this._transform.transformPoint([i, 0]), yb = _b[1];
            var yval = yb - yt;
            var ypos;
            if (yval < 0) {
                ypos = yb;
            }
            else {
                ypos = yt;
            }
            var bar = document.createElementNS(NS_SVG, 'rect');
            bar.setAttribute('x', (xt - barWidth / 2) + 'px');
            bar.setAttribute('y', ypos + 'px');
            bar.setAttribute('width', barWidth + 'px');
            bar.setAttribute('height', Math.abs(yval) + 'px');
            bar.setAttribute('style', style || datagroup_1.DEFAULT_FILL_STYLE);
            domArr.push(bar);
        });
        return domArr;
    };
    DataGroup1D.prototype._update = function () {
        this._computeTransform();
        this._plotDom.splice(0); // Flush current plot doms
        for (var i = 0; i < this._dataArray.length; i++) {
            var data = this._dataArray[i];
            var plotType = this._plotTypeArray[i];
            var type = plotType.type, style = plotType.style, radius = plotType.radius, barwidth = plotType.barwidth;
            switch (type) {
                case 'line':
                    this._plotDom.push(this._genLineDom(data, style));
                    break;
                case 'scatter':
                    this._plotDom = this._plotDom.concat(this._genScatterDom(data, style, radius));
                    break;
                case 'bar':
                    this._plotDom = this._plotDom.concat(this._genBarDom(data, style, barwidth));
                    break;
                case 'area':
                    break;
            }
        }
        var axisDisplay = this.options.axisDisplay || 'visible';
        if (axisDisplay === 'visible') {
            this._updateAxisDom();
        }
        var markerDisplay = this.options.markerDisplay || 'visible';
        if (markerDisplay === 'visible') {
            this._updateMarkerDom();
        }
    };
    return DataGroup1D;
}(datagroup_2.default));
exports.default = DataGroup1D;

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
var NS_SVG = 'http://www.w3.org/2000/svg';
var datagroup_1 = require("./datagroup");
var datagroup_2 = require("./datagroup");
var transform_1 = require("./transform");
/**
 * This DataGroup is for 2-dimensional data with N-data points in each
 * dimension. For e.g. Points on plane
 */
var DataGroup2N = (function (_super) {
    __extends(DataGroup2N, _super);
    function DataGroup2N(width, height, options) {
        var _this = _super.call(this, width, height, options) || this;
        _this._xSeriesGroup = [];
        _this._ySeriesGroup = [];
        return _this;
    }
    /**
     * @param points expected [[x0,y0],[x1,y1],...]
     * @param plotType
     */
    DataGroup2N.prototype.fromPoints = function (points, plotType) {
        this._plotTypeArray.push(plotType);
        var xSeries = [];
        var ySeries = [];
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            xSeries.push(point[0]);
            ySeries.push(point[1]);
        }
        this._xSeriesGroup.push(xSeries);
        this._ySeriesGroup.push(ySeries);
        this._update();
    };
    /**
     * @param xSeries expected [x0,x1,x2,...]
     * @param ySeries expected [y0,y1,y2,...]
     */
    DataGroup2N.prototype.fromSeries = function (xSeries, ySeries, plotType) {
        this._plotTypeArray.push(plotType);
        this._xSeriesGroup.push(xSeries.slice(0));
        this._ySeriesGroup.push(ySeries.slice(0));
        this._update();
    };
    DataGroup2N.prototype._computeTransform = function () {
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
        for (var _i = 0, _a = this._xSeriesGroup; _i < _a.length; _i++) {
            var xseries = _a[_i];
            this.xmin = Math.min.apply(Math, [this.xmin].concat(xseries));
            this.xmax = Math.max.apply(Math, [this.xmax].concat(xseries));
        }
        for (var _b = 0, _c = this._ySeriesGroup; _b < _c.length; _b++) {
            var yseries = _c[_b];
            this.ymin = Math.min.apply(Math, [this.ymin].concat(yseries));
            this.ymax = Math.max.apply(Math, [this.ymax].concat(yseries));
        }
        var xspan = this.xmax - this.xmin;
        var yspan = this.ymax - this.ymin;
        var xmid = (this.xmin + this.xmax) / 2;
        var ymid = (this.ymin + this.ymax) / 2;
        var mx = 0.4 * this.width / (this.xmax - xmid);
        var cx = 0.9 * this.width - mx * this.xmax;
        var my = 0.4 * this.height / (this.ymin - ymid);
        var cy = 0.9 * this.height - my * this.ymin;
        this._transform = new transform_1.default();
        this._transform.setTranslation(cx, cy);
        this._transform.setScale(mx, my);
    };
    DataGroup2N.prototype._genLineDom = function (xdata, ydata, style) {
        var polyline = document.createElementNS(NS_SVG, 'polyline');
        console.assert(xdata.length === ydata.length);
        var coordStrings = [];
        for (var i = 0; i < xdata.length; i++) {
            var x = xdata[i];
            var y = ydata[i];
            var _a = this._transform.transformPoint([x, y]), tx = _a[0], ty = _a[1];
            coordStrings.push(tx + "," + ty);
        }
        polyline.setAttribute('points', coordStrings.join(' '));
        polyline.setAttribute('style', style || datagroup_1.DEFAULT_STROKE_STYLE);
        var g = document.createElementNS(NS_SVG, 'g');
        g.setAttribute('class', 'plot-content');
        g.appendChild(polyline);
        return g;
    };
    DataGroup2N.prototype._genScatterDom = function (xdata, ydata, style, radius) {
        console.assert(xdata.length === ydata.length);
        var g = document.createElementNS(NS_SVG, 'g');
        g.setAttribute('class', 'plot-content');
        for (var i = 0; i < xdata.length; i++) {
            var x = xdata[i];
            var y = ydata[i];
            var _a = this._transform.transformPoint([x, y]), tx = _a[0], ty = _a[1];
            var dot = document.createElementNS(NS_SVG, 'circle');
            dot.setAttribute('cx', tx + 'px');
            dot.setAttribute('cy', ty + 'px');
            dot.setAttribute('r', (radius || 2) + 'px');
            dot.setAttribute('style', style || datagroup_1.DEFAULT_FILL_STYLE);
            g.appendChild(dot);
        }
        return g;
    };
    DataGroup2N.prototype._genBarDom = function (xdata, ydata, style, barwidth) {
        console.assert(xdata.length === ydata.length);
        var g = document.createElementNS(NS_SVG, 'g');
        g.setAttribute('class', 'plot-content');
        var barWidth = barwidth || 8;
        for (var i = 0; i < xdata.length; i++) {
            var x = xdata[i];
            var y = ydata[i];
            var _a = this._transform.transformPoint([x, y]), tx = _a[0], ty = _a[1];
            var _b = this._transform.transformPoint([x, 0]), yb = _b[1];
            var yval = yb - ty;
            var ypos = void 0;
            if (yval < 0) {
                ypos = yb;
            }
            else {
                ypos = ty;
            }
            var bar = document.createElementNS(NS_SVG, 'rect');
            bar.setAttribute('x', (tx - barWidth / 2) + 'px');
            bar.setAttribute('y', ypos + 'px');
            bar.setAttribute('width', barWidth + 'px');
            bar.setAttribute('height', Math.abs(yval) + 'px');
            bar.setAttribute('style', style || datagroup_1.DEFAULT_FILL_STYLE);
            g.appendChild(bar);
        }
        return g;
    };
    DataGroup2N.prototype._update = function () {
        this._computeTransform();
        var plotElements = this.dom.querySelectorAll('.plot-content');
        for (var i = 0; i < plotElements.length; i++) {
            plotElements[i].remove();
        }
        console.assert(this._xSeriesGroup.length === this._ySeriesGroup.length);
        for (var i = 0; i < this._xSeriesGroup.length; i++) {
            var xseries = this._xSeriesGroup[i];
            var yseries = this._ySeriesGroup[i];
            var plotType = this._plotTypeArray[i];
            var style = plotType.style, radius = plotType.radius, type = plotType.type, barwidth = plotType.barwidth;
            switch (type) {
                case 'line':
                    this.dom.appendChild(this._genLineDom(xseries, yseries, style));
                    break;
                case 'scatter':
                    this.dom.appendChild(this._genScatterDom(xseries, yseries, style, radius));
                    break;
                case 'bar':
                    this.dom.appendChild(this._genBarDom(xseries, yseries, style, barwidth));
                    break;
                case 'area':
                    break;
            }
            var axisDisplay = this.options.axisDisplay || 'visible';
            if (axisDisplay === 'visible') {
                this._updateAxisDom();
            }
            var markerDisplay = this.options.markerDisplay || 'visible';
            if (markerDisplay === 'visible') {
                this._updateMarkerDom();
            }
        }
    };
    return DataGroup2N;
}(datagroup_2.default));
exports.default = DataGroup2N;

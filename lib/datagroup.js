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
var DEFAULT_STROKE_STYLE = 'stroke:#000;fill:none';
exports.DEFAULT_STROKE_STYLE = DEFAULT_STROKE_STYLE;
var DEFAULT_FILL_STYLE = 'stroke:none;fill:#000';
exports.DEFAULT_FILL_STYLE = DEFAULT_FILL_STYLE;
var DataGroup = (function () {
    function DataGroup(width, height, options) {
        this.width = width;
        this.height = height;
        this.options = options || {};
        this._plotTypeArray = [];
        this._plotDom = [];
        this._axisDom = [];
        this._markerDom = [];
    }
    Object.defineProperty(DataGroup.prototype, "domArr", {
        get: function () {
            var arr = [];
            arr = arr.concat(this._plotDom);
            arr = arr.concat(this._axisDom);
            arr = arr.concat(this._markerDom);
            return arr;
        },
        enumerable: true,
        configurable: true
    });
    DataGroup.prototype._updateAxisDom = function () {
        this._axisDom.splice(0);
        var transform = this._transform;
        var tymax = transform.transformPoint([0, this.ymax])[1];
        var tymin = transform.transformPoint([0, this.ymin])[1];
        // Add ymax label
        var ymaxLabel = document.createElementNS(NS_SVG, 'text');
        ymaxLabel.textContent = this.ymax + '';
        var ymaxRightPadding = ymaxLabel.textContent.length * 10; // guestimate
        ymaxLabel.setAttribute('x', (this.width - ymaxRightPadding) + 'px');
        ymaxLabel.setAttribute('y', (tymax - 5) + 'px');
        this._axisDom.push(ymaxLabel);
        // Add ymin label
        var yminLabel = document.createElementNS(NS_SVG, 'text');
        yminLabel.textContent = this.ymin + '';
        var yminRightPadding = yminLabel.textContent.length * 10; // guestimate
        yminLabel.setAttribute('x', (this.width - yminRightPadding) + 'px');
        yminLabel.setAttribute('y', (tymin - 5) + 'px');
        this._axisDom.push(yminLabel);
    };
    DataGroup.prototype._updateMarkerDom = function () {
        this._markerDom.splice(0);
        var transform = this._transform;
        // Add ymax line
        var ymaxLine = document.createElementNS(NS_SVG, 'line');
        var tymax = transform.transformPoint([0, this.ymax])[1];
        ymaxLine.setAttribute('id', 'ymax');
        ymaxLine.setAttribute('x1', '0');
        ymaxLine.setAttribute('y1', tymax + 'px');
        ymaxLine.setAttribute('x2', this.width + 'px');
        ymaxLine.setAttribute('y2', tymax + 'px');
        ymaxLine.setAttribute('style', 'stroke:#888;fill:none;stroke-dasharray:4,5');
        this._markerDom.push(ymaxLine);
        // Add ymin line
        var yminLine = document.createElementNS(NS_SVG, 'line');
        var tymin = transform.transformPoint([0, this.ymin])[1];
        yminLine.setAttribute('id', 'ymin');
        yminLine.setAttribute('x1', '0');
        yminLine.setAttribute('y1', tymin + 'px');
        yminLine.setAttribute('x2', this.width + 'px');
        yminLine.setAttribute('y2', tymin + 'px');
        yminLine.setAttribute('style', 'stroke:#888;fill:none;stroke-dasharray:4,5');
        this._markerDom.push(yminLine);
        if (this.ymin < 0 && this.ymax > 0) {
            // Add zero marker
            var zeroLine = document.createElementNS(NS_SVG, 'line');
            var tzero = transform.transformPoint([0, 0])[1];
            zeroLine.setAttribute('id', 'zero');
            zeroLine.setAttribute('x1', '0');
            zeroLine.setAttribute('y1', tzero + 'px');
            zeroLine.setAttribute('x2', this.width + 'px');
            zeroLine.setAttribute('y2', tzero + 'px');
            zeroLine.setAttribute('style', 'stroke:#ccc;fill:none;stroke-dasharray:4,5');
            this._markerDom.push(zeroLine);
        }
    };
    return DataGroup;
}());
exports.default = DataGroup;

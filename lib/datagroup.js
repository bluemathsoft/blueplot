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
function genGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
var DataGroup = (function () {
    function DataGroup(width, height, options) {
        this.guid = genGUID();
        this.width = width;
        this.height = height;
        this.options = options || {};
        this._plotTypeArray = [];
        this.dom = document.createElementNS(NS_SVG, 'g');
        this.dom.setAttribute('class', 'datagroup');
        this.dom.setAttribute('id', this.guid + '-g');
    }
    DataGroup.prototype._updateAxisDom = function () {
        var ymaxLabel = this.dom.querySelector('#ymax-label-' + this.guid);
        if (ymaxLabel) {
            ymaxLabel.remove();
        }
        var yminLabel = this.dom.querySelector('#ymin-label-' + this.guid);
        if (yminLabel) {
            yminLabel.remove();
        }
        var transform = this._transform;
        var tymax = transform.transformPoint([0, this.ymax])[1];
        var tymin = transform.transformPoint([0, this.ymin])[1];
        // Add ymax label
        ymaxLabel = document.createElementNS(NS_SVG, 'text');
        ymaxLabel.textContent = this.ymax + '';
        var ymaxRightPadding = ymaxLabel.textContent.length * 10; // guestimate
        ymaxLabel.setAttribute('x', (this.width - ymaxRightPadding) + 'px');
        ymaxLabel.setAttribute('y', (tymax - 5) + 'px');
        ymaxLabel.setAttribute('id', 'ymax-label-' + this.guid);
        this.dom.appendChild(ymaxLabel);
        // Add ymin label
        yminLabel = document.createElementNS(NS_SVG, 'text');
        yminLabel.textContent = this.ymin + '';
        var yminRightPadding = yminLabel.textContent.length * 10; // guestimate
        yminLabel.setAttribute('x', (this.width - yminRightPadding) + 'px');
        yminLabel.setAttribute('y', (tymin - 5) + 'px');
        yminLabel.setAttribute('id', 'ymin-label-' + this.guid);
        this.dom.appendChild(yminLabel);
    };
    DataGroup.prototype._updateMarkerDom = function () {
        var ymaxLine = this.dom.querySelector('#ymax-line-' + this.guid);
        if (ymaxLine) {
            ymaxLine.remove();
        }
        var yminLine = this.dom.querySelector('#ymin-line-' + this.guid);
        if (yminLine) {
            yminLine.remove();
        }
        var zeroLine = this.dom.querySelector('#zero-line-' + this.guid);
        if (zeroLine) {
            zeroLine.remove();
        }
        var transform = this._transform;
        // Add ymax line
        ymaxLine = document.createElementNS(NS_SVG, 'line');
        var tymax = transform.transformPoint([0, this.ymax])[1];
        ymaxLine.setAttribute('x1', '0');
        ymaxLine.setAttribute('y1', tymax + 'px');
        ymaxLine.setAttribute('x2', this.width + 'px');
        ymaxLine.setAttribute('y2', tymax + 'px');
        ymaxLine.setAttribute('style', 'stroke:#888;fill:none;stroke-dasharray:4,5');
        ymaxLine.setAttribute('id', 'ymax-line-' + this.guid);
        this.dom.appendChild(ymaxLine);
        // Add ymin line
        yminLine = document.createElementNS(NS_SVG, 'line');
        var tymin = transform.transformPoint([0, this.ymin])[1];
        yminLine.setAttribute('x1', '0');
        yminLine.setAttribute('y1', tymin + 'px');
        yminLine.setAttribute('x2', this.width + 'px');
        yminLine.setAttribute('y2', tymin + 'px');
        yminLine.setAttribute('id', 'ymin-line-' + this.guid);
        yminLine.setAttribute('style', 'stroke:#888;fill:none;stroke-dasharray:4,5');
        this.dom.appendChild(yminLine);
        if (this.ymin < 0 && this.ymax > 0) {
            // Add zero marker
            var zeroLine_1 = document.createElementNS(NS_SVG, 'line');
            var tzero = transform.transformPoint([0, 0])[1];
            zeroLine_1.setAttribute('x1', '0');
            zeroLine_1.setAttribute('y1', tzero + 'px');
            zeroLine_1.setAttribute('x2', this.width + 'px');
            zeroLine_1.setAttribute('y2', tzero + 'px');
            zeroLine_1.setAttribute('id', 'zero-line-' + this.guid);
            zeroLine_1.setAttribute('style', 'stroke:#ccc;fill:none;stroke-dasharray:4,5');
            this.dom.appendChild(zeroLine_1);
        }
    };
    return DataGroup;
}());
exports.default = DataGroup;

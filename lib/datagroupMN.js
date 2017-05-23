"use strict";
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
var kolor_1 = require("./kolor");
var NS_SVG = 'http://www.w3.org/2000/svg';
function isInteger(value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
}
var DataGroupMN = (function (_super) {
    __extends(DataGroupMN, _super);
    function DataGroupMN(width, height, options) {
        return _super.call(this, width, height, options) || this;
    }
    DataGroupMN.prototype.from2DData = function (data, plotType) {
        if (this._data) {
            this._lastdata = JSON.parse(JSON.stringify(this._data));
        }
        this._data = data;
        this._plotType = plotType;
        this._update();
    };
    DataGroupMN.prototype._genGridDom = function (data) {
        var g = document.createElementNS(NS_SVG, 'g');
        var nrows = data.length;
        var ncols = 0;
        for (var i = 0; i < data.length; i++) {
            ncols = Math.max(ncols, data[i].length);
        }
        var cellW = this.width / ncols;
        var cellH = this.height / nrows;
        var cellMargin = 8;
        var baseColor = new kolor_1.default(1.0, 0.2, 0.0);
        var cellRects = [];
        for (var i = 0; i < data.length; i++) {
            cellRects[i] = [];
            for (var j = 0; j < data[i].length; j++) {
                var v = data[i][j];
                var sat = this._m * v + this._c;
                var fillColor = baseColor.clone().setSaturation(sat);
                var rect = document.createElementNS(NS_SVG, 'rect');
                rect.setAttribute('width', (cellW - cellMargin / 2) + 'px');
                rect.setAttribute('height', (cellH - cellMargin / 2) + 'px');
                rect.setAttribute('x', (j * cellW + cellMargin / 2) + 'px');
                rect.setAttribute('y', (i * cellH + cellMargin / 2) + 'px');
                rect.setAttribute('style', 'fill:' + fillColor.toCSSHex());
                var text = document.createElementNS(NS_SVG, 'text');
                text.setAttribute('x', (j * cellW + cellW / 2) + 'px');
                text.setAttribute('y', (i * cellH + cellH / 2) + 'px');
                if (isInteger(v)) {
                    text.textContent = Math.round(v) + '';
                }
                else {
                    text.textContent = v.toFixed(2);
                }
                cellRects[i].push(rect);
                g.appendChild(rect);
                g.appendChild(text);
            }
        }
        if (this._changed) {
            for (var _i = 0, _a = this._changed; _i < _a.length; _i++) {
                var _b = _a[_i], i = _b[0], j = _b[1];
                var style = cellRects[i][j].getAttribute('style');
                style = style + ';stroke:#000;stroke-width:2';
                cellRects[i][j].setAttribute('style', style);
            }
        }
        return g;
    };
    DataGroupMN.prototype._computeTransform = function () {
        var vmax = -Infinity;
        var vmin = Infinity;
        for (var i = 0; i < this._data.length; i++) {
            for (var j = 0; j < this._data[i].length; j++) {
                vmax = Math.max(vmax, this._data[i][j]);
                vmin = Math.min(vmin, this._data[i][j]);
            }
        }
        /*
        * vmin <=> Saturation=0
        * vmax <=> Saturation=1
        * =>
        * 0 = m*vmin + c
        * 1 = m*vmax + c
        * Solving,
        * m = 1/(vmax-vmin)
        * c = 1-vmax/(vmax-vmin)
        */
        var vspan = vmax - vmin;
        this._m = 1 / vspan;
        this._c = 1 - vmax / vspan;
    };
    DataGroupMN.prototype._findChangedCellsInLastChange = function () {
        if (!this._lastdata) {
            return;
        }
        this._changed = [];
        for (var i = 0; i < this._data.length; i++) {
            for (var j = 0; j < this._data[i].length; j++) {
                if (this._lastdata[i][j] !== this._data[i][j]) {
                    this._changed.push([i, j]);
                }
            }
        }
    };
    DataGroupMN.prototype._update = function () {
        this._computeTransform();
        var _a = this._plotType, style = _a.style, radius = _a.radius, type = _a.type, barwidth = _a.barwidth, timetrail = _a.timetrail;
        if (timetrail) {
            this._findChangedCellsInLastChange();
        }
        var plotContentElems = this.dom.querySelectorAll('.plot-content');
        for (var i = 0; i < plotContentElems.length; i++) {
            plotContentElems[i].remove();
        }
        this.dom.appendChild(this._genGridDom(this._data));
    };
    return DataGroupMN;
}(datagroup_1.default));
exports.default = DataGroupMN;

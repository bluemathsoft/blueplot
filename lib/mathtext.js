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
var MathText = (function () {
    function MathText(textContent) {
        this.dom = document.createElement('p');
        this.dom.textContent = textContent;
    }
    return MathText;
}());
exports.default = MathText;

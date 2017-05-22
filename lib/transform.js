"use strict";
/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math.  If not, see <http://www.gnu.org/licenses/>.

 */
Object.defineProperty(exports, "__esModule", { value: true });
var Transform = (function () {
    function Transform(array) {
        if (array) {
            this.fromArray(array);
        }
        else {
            // Identity transform
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
        this._cachedInverse = undefined;
    }
    /**
     * Is this transform Identity
     * @returns {boolean}
     */
    Transform.prototype.isIdentity = function () {
        return this.a === 1 && this.b === 0 && this.c === 0 &&
            this.d === 1 && this.e === 1 && this.f === 0;
    };
    /**
     * Adds to the translation of this transform
     */
    Transform.prototype.translate = function (dx, dy) {
        this.e += dx;
        this.f += dy;
        this._cachedInverse = undefined;
        return this;
    };
    /**
     * Replaces translation of this transform to input value
     */
    Transform.prototype.setTranslation = function (x, y) {
        this.e = x;
        this.f = y;
        this._cachedInverse = undefined;
        return this;
    };
    /**
     * Replaces rotation values of this transform with those generated for new
     * angular rotation
     */
    Transform.prototype.setRotation = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.a = c;
        this.b = s;
        this.c = -s;
        this.d = c;
        this._cachedInverse = undefined;
        return this;
    };
    /**
     * Creates transform that will rotate a point through an angle around a given
     * point
     */
    Transform.rotateAround = function (angle, point) {
        // Ref: http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/
        var pre = new Transform().translate(point[0], point[1]);
        var rotation = new Transform().setRotation(angle);
        var post = new Transform().translate(-point[0], -point[1]);
        return pre.mul(rotation).mul(post);
    };
    /**
     * Creates transform that will scale a point by given scale around a given
     * point
     */
    Transform.scaleAround = function (_a, point) {
        var sx = _a[0], sy = _a[1];
        var pre = new Transform().translate(point[0], point[1]);
        var scale = new Transform().setScale(sx, sy);
        var post = new Transform().translate(-point[0], -point[1]);
        return pre.mul(scale).mul(post);
    };
    /**
     * Creates a transform that will rotate and scale a point around a given point
     * @param angle
     * @param sx
     * @param sy
     * @param point
     * @returns {Transform}
     */
    Transform.rotateAndScaleAround = function (angle, _a, point) {
        var sx = _a[0], sy = _a[1];
        var pre = new Transform().translate(point[0], point[1]);
        var rotation = new Transform().setRotation(angle);
        var scale = new Transform().setScale(sx, sy);
        var post = new Transform().translate(-point[0], -point[1]);
        return pre.mul(rotation).mul(scale).mul(post);
    };
    /**
     * Multiples current scale of this transform by input scale values
     */
    Transform.prototype.scale = function (sx, sy) {
        this.a *= sx;
        this.d *= sy;
        this._cachedInverse = undefined;
        return this;
    };
    /**
     * Replaces current scale values of this transform by input scale values
     */
    Transform.prototype.setScale = function (sx, sy) {
        this.a = sx;
        this.d = sy;
        this._cachedInverse = undefined;
        return this;
    };
    /**
     * Return scale of this transform
     * @returns {number[]}
     */
    Transform.prototype.getScale = function () {
        return [this.a, this.d];
    };
    /**
     * Return translation of this transform
     * @returns {number[]}
     */
    Transform.prototype.getTranslation = function () {
        return [this.e, this.f];
    };
    /**
     * Return array representation of this transform as described in
     * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
     * @returns {number[]}
     */
    Transform.prototype.toArray = function () {
        return [this.a, this.b, this.c, this.d, this.e, this.f];
    };
    /**
     * Return transform attribute string as described in
     * {@link https://www.w3.org/TR/SVG/coords.html#TransformAttribute SVG Spec}
     * @param precision
     * @returns {string}
     */
    Transform.prototype.toAttributeString = function (precision) {
        if (precision === void 0) { precision = 2; }
        return "matrix(" + this.toArray().map(function (x) { return x.toFixed(precision); }).join(',') + ")";
    };
    /**
     * Replace values of this transform with the ones in input array.
     * Array format is as described in
     * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
     * @param a
     * @param b
     * @param c
     * @param d
     * @param e
     * @param f
     */
    Transform.prototype.fromArray = function (_a) {
        var a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4], f = _a[5];
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this._cachedInverse = undefined;
    };
    /*
     * The transformation matrix is
     *     -           -
     *     |  a  c  e  |
     * M = |  b  d  f  |
     *     |  0  0  1  |
     *     -           -
     * Det(M) = ad - bc
     *              -           - T
     *              |  A  C  E  |
     * Inverse(M) = |  B  D  F  |   * (1/Det(M))
     *              |  G  H  I  |
     *              -           -
     * A = d
     * B = -c
     * G = cf-de
     * C = -b
     * D = a
     * H = be-af
     * E = 0
     * F = 0
     * I = ad-bc
     * =>
     *              -                 -
     *              |   d  -c  cf-de  |
     * Inverse(M) = |  -b   a  be-af  |  * (1/Det(M))
     *              |   0   0  ad-bc  |
     *              -                 -
     * =>
     *              -              -
     *              |  ai  ci  ei  |
     * Inverse(M) = |  bi  di  fi  |
     *              |  0   0   1   |
     *              -              -
     */
    /**
     * Inverse of this transform
     * @returns {Transform}
     */
    Transform.prototype.inverse = function () {
        if (!this._cachedInverse) {
            var _a = this, a = _a.a, b = _a.b, c = _a.c, d = _a.d, e = _a.e, f = _a.f;
            var det = a * d - b * c;
            var ai = d / det;
            var bi = -b / det;
            var ci = -c / det;
            var di = a / det;
            var ei = (c * f - d * e) / det;
            var fi = (b * e - a * f) / det;
            this._cachedInverse = new Transform([ai, bi, ci, di, ei, fi]);
        }
        return this._cachedInverse;
    };
    /*
     *      -              -
     *      |  a1  c1  e1  |
     * m1 = |  b1  d1  f1  |
     *      |  0   0   1   |
     *      -              -
     *      -              -
     *      |  a2  c2  e2  |
     * m2 = |  b2  d2  f2  |
     *      |  0   0   1   |
     *      -              -
     *
     *         -                                          -
     *         | a1*a2+c1*b2  a1*c2+c1*d2  a1*e2+c1*f2+e1 |
     * m1*m2 = | b1*a2+d1*b2  b1*c2+d1*d2  b1*e2+d1*f2+f1 |
     *         | 0            0            1              |
     *         -                                          -
     *
     */
    /**
     * Multiply this transform with other transform. Return a new Transform
     * object. Doesn't affect contents of this Transform
     */
    Transform.prototype.mul = function (other) {
        var _a = this, a1 = _a.a, b1 = _a.b, c1 = _a.c, d1 = _a.d, e1 = _a.e, f1 = _a.f;
        var a2 = other.a, b2 = other.b, c2 = other.c, d2 = other.d, e2 = other.e, f2 = other.f;
        return new Transform([
            a1 * a2 + c1 * b2,
            b1 * a2 + d1 * b2,
            a1 * c2 + c1 * d2,
            b1 * c2 + d1 * d2,
            a1 * e2 + c1 * f2 + e1,
            b1 * e2 + d1 * f2 + f1
        ]);
    };
    /**
     * Transform input point
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    Transform.prototype.transformPoint = function (_a) {
        var x = _a[0], y = _a[1];
        var _b = this, a = _b.a, b = _b.b, c = _b.c, d = _b.d, e = _b.e, f = _b.f;
        return [
            a * x + c * y + e,
            b * x + d * y + f
        ];
    };
    /**
     * Clone this transform
     * @returns {Transform}
     */
    Transform.prototype.clone = function () {
        return new Transform(this.toArray());
    };
    /**
     * Identity transform object
     * @returns {Transform}
     */
    Transform.identity = function () {
        return new Transform();
    };
    return Transform;
}());
exports.default = Transform;

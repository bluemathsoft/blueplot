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


export default class Transform {

  a : number;
  b : number;
  c : number;
  d : number;
  e : number;
  f : number;
  private _cachedInverse? : Transform;

  constructor(array?:Array<number>) {
    if(array) {
      this.fromArray(array);
    } else {
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
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 &&
      this.d === 1 && this.e === 1 && this.f === 0;
  }

  /**
   * Adds to the translation of this transform
   */
  translate(dx:number,dy:number) {
    this.e += dx;
    this.f += dy;
    this._cachedInverse = undefined;
    return this;
  }

  /**
   * Replaces translation of this transform to input value
   */
  setTranslation(x:number, y:number) {
    this.e = x;
    this.f = y;
    this._cachedInverse = undefined;
    return this;
  }

  /**
   * Replaces rotation values of this transform with those generated for new
   * angular rotation
   */
  setRotation(angle:number) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    this.a = c;
    this.b = s;
    this.c = -s;
    this.d = c;
    this._cachedInverse = undefined;
    return this;
  }

  /**
   * Creates transform that will rotate a point through an angle around a given
   * point
   */
  static rotateAround(angle:number, point:Array<number>) {
    // Ref: http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/
    let pre = new Transform().translate(point[0], point[1]);
    let rotation = new Transform().setRotation(angle);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(rotation).mul(post);
  }

  /**
   * Creates transform that will scale a point by given scale around a given
   * point
   */
  static scaleAround([sx,sy]:Array<number>, point:Array<number>) {
    let pre = new Transform().translate(point[0], point[1]);
    let scale = new Transform().setScale(sx,sy);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(scale).mul(post);
  }

  /**
   * Creates a transform that will rotate and scale a point around a given point
   * @param angle
   * @param sx
   * @param sy
   * @param point
   * @returns {Transform}
   */
  static rotateAndScaleAround(
    angle:number, [sx,sy]:Array<number>, point:Array<number>)
  {
    let pre = new Transform().translate(point[0], point[1]);
    let rotation = new Transform().setRotation(angle);
    let scale = new Transform().setScale(sx,sy);
    let post = new Transform().translate(-point[0], -point[1]);
    return pre.mul(rotation).mul(scale).mul(post);
  }

  /**
   * Multiples current scale of this transform by input scale values
   */
  scale(sx:number, sy:number) {
    this.a *= sx;
    this.d *= sy;
    this._cachedInverse = undefined;
    return this;
  }

  /**
   * Replaces current scale values of this transform by input scale values
   */
  setScale(sx:number, sy:number) {
    this.a = sx;
    this.d = sy;
    this._cachedInverse = undefined;
    return this;
  }

  /**
   * Return scale of this transform
   * @returns {number[]}
   */
  getScale() {
    return [this.a, this.d];
  }

  /**
   * Return translation of this transform
   * @returns {number[]}
   */
  getTranslation() {
    return [this.e, this.f];
  }

  /**
   * Return array representation of this transform as described in
   * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
   * @returns {number[]}
   */
  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

  /**
   * Return transform attribute string as described in
   * {@link https://www.w3.org/TR/SVG/coords.html#TransformAttribute SVG Spec}
   * @param precision
   * @returns {string}
   */
  toAttributeString(precision=2) {
    return `matrix(${this.toArray().map(x=>x.toFixed(precision)).join(',')})`;
  }

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
  fromArray([a,b,c,d,e,f]:Array<number>) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    this._cachedInverse = undefined;
  }

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
  inverse() {
    if(!this._cachedInverse) {
      let {a,b,c,d,e,f} = this;
      let det = a*d-b*c;
      let ai = d/det;
      let bi = -b/det;
      let ci = -c/det;
      let di = a/det;
      let ei = (c*f-d*e)/det;
      let fi = (b*e-a*f)/det;
      this._cachedInverse = new Transform([ai,bi,ci,di,ei,fi]);
    }
    return this._cachedInverse;
  }

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
  mul(other:Transform) {
    let {a:a1,b:b1,c:c1,d:d1,e:e1,f:f1} = this;
    let {a:a2,b:b2,c:c2,d:d2,e:e2,f:f2} = other;

    return new Transform([
      a1*a2+c1*b2,
      b1*a2+d1*b2,
      a1*c2+c1*d2,
      b1*c2+d1*d2,
      a1*e2+c1*f2+e1,
      b1*e2+d1*f2+f1
    ]);
  }

  /**
   * Transform input point
   * @param {number} x
   * @param {number} y
   * @returns {number[]}
   */
  transformPoint([x,y]:Array<number>) {
    let {a,b,c,d,e,f} = this;
    return [
      a*x + c*y + e,
      b*x + d*y + f
    ];
  }

  /**
   * Clone this transform
   * @returns {Transform}
   */
  clone() {
    return new Transform(this.toArray());
  }

  /**
   * Identity transform object
   * @returns {Transform}
   */
  static identity() {
    return new Transform();
  }
}


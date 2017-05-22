export default class Transform {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    private _cachedInverse?;
    constructor(array?: Array<number>);
    /**
     * Is this transform Identity
     * @returns {boolean}
     */
    isIdentity(): boolean;
    /**
     * Adds to the translation of this transform
     */
    translate(dx: number, dy: number): this;
    /**
     * Replaces translation of this transform to input value
     */
    setTranslation(x: number, y: number): this;
    /**
     * Replaces rotation values of this transform with those generated for new
     * angular rotation
     */
    setRotation(angle: number): this;
    /**
     * Creates transform that will rotate a point through an angle around a given
     * point
     */
    static rotateAround(angle: number, point: Array<number>): Transform;
    /**
     * Creates transform that will scale a point by given scale around a given
     * point
     */
    static scaleAround([sx, sy]: Array<number>, point: Array<number>): Transform;
    /**
     * Creates a transform that will rotate and scale a point around a given point
     * @param angle
     * @param sx
     * @param sy
     * @param point
     * @returns {Transform}
     */
    static rotateAndScaleAround(angle: number, [sx, sy]: Array<number>, point: Array<number>): Transform;
    /**
     * Multiples current scale of this transform by input scale values
     */
    scale(sx: number, sy: number): this;
    /**
     * Replaces current scale values of this transform by input scale values
     */
    setScale(sx: number, sy: number): this;
    /**
     * Return scale of this transform
     * @returns {number[]}
     */
    getScale(): number[];
    /**
     * Return translation of this transform
     * @returns {number[]}
     */
    getTranslation(): number[];
    /**
     * Return array representation of this transform as described in
     * {@link https://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined SVG Spec}
     * @returns {number[]}
     */
    toArray(): number[];
    /**
     * Return transform attribute string as described in
     * {@link https://www.w3.org/TR/SVG/coords.html#TransformAttribute SVG Spec}
     * @param precision
     * @returns {string}
     */
    toAttributeString(precision?: number): string;
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
    fromArray([a, b, c, d, e, f]: Array<number>): void;
    /**
     * Inverse of this transform
     * @returns {Transform}
     */
    inverse(): Transform;
    /**
     * Multiply this transform with other transform. Return a new Transform
     * object. Doesn't affect contents of this Transform
     */
    mul(other: Transform): Transform;
    /**
     * Transform input point
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    transformPoint([x, y]: Array<number>): number[];
    /**
     * Clone this transform
     * @returns {Transform}
     */
    clone(): Transform;
    /**
     * Identity transform object
     * @returns {Transform}
     */
    static identity(): Transform;
}

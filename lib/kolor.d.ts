interface RGBDef {
    r: number;
    g: number;
    b: number;
    a?: number;
}
interface HSVDef {
    h: number;
    s: number;
    v: number;
    a?: number;
}
export { RGBDef, HSVDef };
export default class Kolor {
    private rgb?;
    private hsv?;
    private a;
    /**
     * @example
     * // Following ways are supported to construct Kolor object
     * new Kolor(); // Creates Black color with alpha = 1.0
     * new Kolor(r,g,b,a); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor([r,g,b,a]); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor({r,g,b,a}); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor({h,s,v,a}); // each of h,s,v,a should be in 0.0 to 1.0, otherwise undefined behavior
     */
    constructor(arg1: RGBDef | HSVDef | number[] | number, arg2?: number, arg3?: number, arg4?: number);
    clone(): Kolor;
    /**
     * Returns RGB value
     * @returns {Number[]} Each of RGB values is in range 0.0 to 1.0
     */
    RGB(): number[];
    /**
     * Returns HSV value
     * @returns {Number[]} Each of HSV values is in range 0.0 to 1.0
     */
    HSV(): number[];
    /**
     * Returns CSS string for this color value
     * @param {Number} [bytes=2] Number of bytes to use (default 2)
     * @returns {string}
     */
    toCSS(bytes?: number): string;
    /**
     * Returns CSS string of format `#xxx` for this color value
     * The returned value format doesn't support alpha, hence it's ignored
     * @param {Number} [bytes=2] Number of bytes to use (default 2)
     * @returns {string}
     */
    toCSSHex(bytes?: number): string;
    /**
     * Get Alpha
     * @returns {Number}
     */
    alpha(): number;
    /**
     * Set Alpha
     * @param {!Number} a
     * @returns {Kolor} this instance
     */
    setAlpha(a: number): this;
    /**
     * Get Hue
     * @returns {Number}
     */
    hue(): number;
    /**
     * Set Hue
     * @param {!Number} h
     * @returns {Kolor} this instance
     */
    setHue(h: number): this;
    /**
     * Get Saturation
     * @returns {Number}
     */
    saturation(): number;
    /**
     * Set Saturation
     * @param {!Number} s
     * @returns {Kolor} this instance
     */
    setSaturation(s: number): this;
    /**
     * Get Value
     * @returns {Number}
     */
    value(): number;
    /**
     * Set Value
     * @param {!Number} v
     * @returns {Kolor} this instance
     */
    setValue(v: number): this;
    /**
     * Get Red
     * @returns {Number}
     */
    red(): number;
    /**
     * Set Red
     * @param {!Number} r
     * @returns {Kolor} this instance
     */
    setRed(r: number): this;
    /**
     * Get Green
     * @returns {Number}
     */
    green(): number;
    /**
     * Set Green
     * @param {!Number} g
     * @returns {Kolor} this instance
     */
    setGreen(g: number): this;
    /**
     * Get Blue
     * @returns {Number}
     */
    blue(): number;
    /**
     * Set Blue
     * @param {!Number} b
     * @returns {Kolor} this instance
     */
    setBlue(b: number): this;
    /**
     * Returns RGBA value
     * @returns {Number[]}
     */
    RGBA(): number[];
    /**
     * Generate Memento
     * @returns {Object} Memento
     */
    toMemento(): number[];
    /**
     * To String
     * @returns {string}
     */
    toString(): string;
    /**
     * Generate random color
     * @returns {Kolor}
     */
    static random(): Kolor;
}

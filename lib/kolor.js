"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRGB(arg) {
    return arg.r !== undefined;
}
function isHSV(arg) {
    return arg.h !== undefined;
}
function isRGBArray(arg) {
    return Array.isArray(arg);
}
var Kolor = (function () {
    /**
     * @example
     * // Following ways are supported to construct Kolor object
     * new Kolor(); // Creates Black color with alpha = 1.0
     * new Kolor(r,g,b,a); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor([r,g,b,a]); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor({r,g,b,a}); // each of r,g,b,a should be in 0.0 to 1.0, otherwise undefined behavior
     * new Kolor({h,s,v,a}); // each of h,s,v,a should be in 0.0 to 1.0, otherwise undefined behavior
     */
    function Kolor(arg1, arg2, arg3, arg4) {
        if (isRGB(arg1)) {
            this.rgb = [
                arg1.r,
                arg1.g,
                arg1.b
            ];
            if (arg1.a === undefined || arg1.a === null) {
                this.a = 1.0;
            }
            else {
                this.a = arg1.a;
            }
        }
        else if (isHSV(arg1)) {
            this.hsv = [
                arg1.h,
                arg1.s,
                arg1.v
            ];
            if (arg1.a === undefined || arg1.a === null) {
                this.a = 1.0;
            }
            else {
                this.a = arg1.a;
            }
        }
        else if (isRGBArray(arg1)) {
            this.rgb = [arg1[0], arg1[1], arg1[2]];
            if (arg1[3] === undefined || arg1[3] === null) {
                this.a = 1.0;
            }
            else {
                this.a = arg1[3];
            }
        }
        else {
            this.rgb = [arg1, arg2 || 0.0, arg3 || 0.0];
            if (arg4 === undefined || arg4 === null) {
                this.a = 0.0;
            }
            else {
                this.a = arg4;
            }
        }
    }
    Kolor.prototype.clone = function () {
        var _a = this.RGB(), r = _a[0], g = _a[1], b = _a[2];
        return new Kolor(r, g, b, this.a);
    };
    /**
     * Returns RGB value
     * @returns {Number[]} Each of RGB values is in range 0.0 to 1.0
     */
    Kolor.prototype.RGB = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return this.rgb.slice();
    };
    /**
     * Returns HSV value
     * @returns {Number[]} Each of HSV values is in range 0.0 to 1.0
     */
    Kolor.prototype.HSV = function () {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        return this.hsv.slice();
    };
    /**
     * Returns CSS string for this color value
     * @param {Number} [bytes=2] Number of bytes to use (default 2)
     * @returns {string}
     */
    Kolor.prototype.toCSS = function (bytes) {
        if (bytes === void 0) { bytes = 2; }
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        if (this.a >= 1.0)
            return this.toCSSHex(bytes);
        var red = this.rgb[0];
        var green = this.rgb[1];
        var blue = this.rgb[2];
        var alpha = this.a;
        var max = 255;
        var components = [
            'rgba(',
            Math.max(0, Math.min(max, Math.round(red * max))), ',',
            Math.max(0, Math.min(max, Math.round(green * max))), ',',
            Math.max(0, Math.min(max, Math.round(blue * max))), ',',
            Math.max(0, Math.min(1.0, alpha)).toFixed(3),
            ')'
        ];
        return components.join('');
    };
    /**
     * Returns CSS string of format `#xxx` for this color value
     * The returned value format doesn't support alpha, hence it's ignored
     * @param {Number} [bytes=2] Number of bytes to use (default 2)
     * @returns {string}
     */
    Kolor.prototype.toCSSHex = function (bytes) {
        if (bytes === void 0) { bytes = 2; }
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        var red = this.rgb[0];
        var green = this.rgb[1];
        var blue = this.rgb[2];
        bytes = bytes || 2;
        var max = Math.pow(16, bytes) - 1;
        var css = [
            "#",
            pad(Math.round(red * max).toString(16).toUpperCase(), bytes),
            pad(Math.round(green * max).toString(16).toUpperCase(), bytes),
            pad(Math.round(blue * max).toString(16).toUpperCase(), bytes)
        ];
        return css.join('');
    };
    /**
     * Get Alpha
     * @returns {Number}
     */
    Kolor.prototype.alpha = function () {
        return this.a;
    };
    /**
     * Set Alpha
     * @param {!Number} a
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setAlpha = function (a) {
        this.a = a;
        return this;
    };
    /**
     * Get Hue
     * @returns {Number}
     */
    Kolor.prototype.hue = function () {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        return this.hsv[0];
    };
    /**
     * Set Hue
     * @param {!Number} h
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setHue = function (h) {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        this.hsv[0] = h;
        this.rgb = undefined; // to force RGB recalculation
        return this;
    };
    /**
     * Get Saturation
     * @returns {Number}
     */
    Kolor.prototype.saturation = function () {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        return this.hsv[1];
    };
    /**
     * Set Saturation
     * @param {!Number} s
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setSaturation = function (s) {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        this.hsv[1] = s;
        this.rgb = undefined; // to force RGB recalculation
        return this;
    };
    /**
     * Get Value
     * @returns {Number}
     */
    Kolor.prototype.value = function () {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        return this.hsv[2];
    };
    /**
     * Set Value
     * @param {!Number} v
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setValue = function (v) {
        if (!this.hsv) {
            this.hsv = rgb2hsv(this.rgb);
        }
        this.hsv[2] = v;
        this.rgb = undefined; // to force RGB recalculation
        return this;
    };
    /**
     * Get Red
     * @returns {Number}
     */
    Kolor.prototype.red = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return this.rgb[0];
    };
    /**
     * Set Red
     * @param {!Number} r
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setRed = function (r) {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        this.rgb[0] = r;
        this.hsv = undefined; // to force HSV recalculation
        return this;
    };
    /**
     * Get Green
     * @returns {Number}
     */
    Kolor.prototype.green = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return this.rgb[1];
    };
    /**
     * Set Green
     * @param {!Number} g
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setGreen = function (g) {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        this.rgb[1] = g;
        this.hsv = undefined; // to force HSV recalculation
        return this;
    };
    /**
     * Get Blue
     * @returns {Number}
     */
    Kolor.prototype.blue = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return this.rgb[2];
    };
    /**
     * Set Blue
     * @param {!Number} b
     * @returns {Kolor} this instance
     */
    Kolor.prototype.setBlue = function (b) {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        this.rgb[2] = b;
        this.hsv = undefined; // to force HSV recalculation
        return this;
    };
    /**
     * Returns RGBA value
     * @returns {Number[]}
     */
    Kolor.prototype.RGBA = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return [
            this.rgb[0],
            this.rgb[1],
            this.rgb[2],
            this.a
        ];
    };
    /**
     * Generate Memento
     * @returns {Object} Memento
     */
    Kolor.prototype.toMemento = function () {
        if (!this.rgb) {
            this.rgb = hsv2rgb(this.hsv);
        }
        return [this.rgb[0], this.rgb[1], this.rgb[2], this.a];
    };
    /**
     * To String
     * @returns {string}
     */
    Kolor.prototype.toString = function () {
        var r = this.red();
        var g = this.green();
        var b = this.blue();
        var a = this.alpha();
        return "rgba(" + Math.round(255 * r) + "," +
            (Math.round(255 * g) + ",") +
            (Math.round(255 * b) + "," + a + ")");
    };
    /**
     * Generate random color
     * @returns {Kolor}
     */
    Kolor.random = function () {
        return new Kolor([
            Math.random(),
            Math.random(),
            Math.random(),
            1.0
        ]);
    };
    return Kolor;
}());
exports.default = Kolor;
/* takes a value, converts to string if need be, then pads it
 * to a minimum length.
 */
function pad(val, len) {
    val = val.toString();
    var padded = [];
    for (var i = 0, j = Math.max(len - val.length, 0); i < j; i++) {
        padded.push('0');
    }
    padded.push(val);
    return padded.join('');
}
function hsv2rgb(hsv) {
    if (!hsv) {
        throw new Error('Invalid hsv input');
    }
    var hue = hsv[0];
    var saturation = hsv[1];
    var value = hsv[2];
    hue %= 360;
    saturation = Math.min(Math.max(0, saturation), 1);
    value = Math.min(1, Math.max(0, value));
    var i;
    var f, p, q, t;
    var red, green, blue;
    if (saturation === 0) {
        // achromatic (grey)
        return [value, value, value];
    }
    var h = hue / 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // fractional part of h
    p = value * (1 - saturation);
    q = value * (1 - saturation * f);
    t = value * (1 - saturation * (1 - f));
    switch (i) {
        case 0:
            red = value;
            green = t;
            blue = p;
            break;
        case 1:
            red = q;
            green = value;
            blue = p;
            break;
        case 2:
            red = p;
            green = value;
            blue = t;
            break;
        case 3:
            red = p;
            green = q;
            blue = value;
            break;
        case 4:
            red = t;
            green = p;
            blue = value;
            break;
        default:
            red = value;
            green = p;
            blue = q;
            break;
    }
    return [red, green, blue];
}
function rgb2hsv(rgb) {
    if (!rgb) {
        throw new Error('Invalid rgb input');
    }
    var red = rgb[0];
    var green = rgb[1];
    var blue = rgb[2];
    var min, max, delta;
    var hue, saturation, value;
    min = Math.min(red, green, blue);
    max = Math.max(red, green, blue);
    value = max; // v
    delta = max - min;
    if (delta == 0) {
        hue = saturation = 0;
    }
    else {
        saturation = delta / max;
        if (red == max) {
            hue = (green - blue) / delta; // between yellow & magenta
        }
        else if (green == max) {
            hue = 2 + (blue - red) / delta; // between cyan & yellow
        }
        else {
            hue = 4 + (red - green) / delta; // between magenta & cyan
        }
        hue = ((hue * 60) + 360) % 360; // degrees
    }
    return [hue, saturation, value];
}

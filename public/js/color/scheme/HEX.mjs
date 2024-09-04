import {RGB} from './RGB.mjs'

/** @typedef {import('./LCH.mjs').LCH} LCH */
/** @typedef {import('./HSLUV.mjs').HSLUV} HSLUV */
/** @typedef {import('./HPLUV.mjs').HPLUV} HPLUV */


const hexChars = '0123456789abcdef'

/**
 * @param {string} hex
 * @param {number} offset
 * @returns {number}
 */
const hexToRgbChannel = (hex, offset) => {
    const digit1 = hexChars.indexOf(hex.charAt(offset))
    const digit2 = hexChars.indexOf(hex.charAt(offset + 1))
    const n = digit1 * 16 + digit2
    return n / 255.0
}

export class HEX {
    hex = '#000000'

    /** @returns {string} */
    toString() {
        return this.hex
    }

    get rgb() {
        const rgb = new RGB()
        this.hex = this.hex.toLowerCase()

        rgb.r = hexToRgbChannel(this.hex, 1)
        rgb.g = hexToRgbChannel(this.hex, 3)
        rgb.b = hexToRgbChannel(this.hex, 5)

        return rgb
    }

    /** @returns {LCH} */
    get lch() {
        return this.rgb.xyz.luv.lch
    }

    /** @returns {HSLUV} */
    get hsluv() {
        return this.lch.hsluv
    }

    /** @returns {HPLUV} */
    get hpluv() {
        return this.lch.hpluv
    }

}

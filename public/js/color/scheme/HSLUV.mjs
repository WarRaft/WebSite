import {LCH} from './LCH.mjs'
import {Chroma} from './utils/Chroma.mjs'
import {HEX} from './HEX.mjs'

/** @typedef {import('./RGB.mjs').RGB} RGB */

export class HSLUV extends Chroma {
    h = 0
    s = 0
    l = 0

    static fromHexString(hex) {
        const h = new HEX()
        h.hex = hex
        return h.hsluv
    }

    get clone() {
        const hsluv = new HSLUV()
        hsluv.h = this.h
        hsluv.s = this.s
        hsluv.l = this.l
        return hsluv
    }

    toString() {
        return `HSLUV(${this.h.toFixed(2)}, ${this.s.toFixed(2)}, ${this.l.toFixed(2)})`
    }

    get lch() {
        const lch = new LCH()

        if (this.l > 99.9999999) {
            lch.l = 100
            lch.c = 0
        } else if (this.l < 0.00000001) {
            lch.l = 0
            lch.c = 0
        } else {
            lch.l = this.l
            this.calculateBoundingLines(this.l)
            const max = this.calcMaxChromaHsluv(this.h)
            lch.c = max / 100 * this.s
        }
        lch.h = this.h

        return lch
    }

    /** @returns {RGB} */
    get rgb() {
        return this.lch.luv.xyz.rgb
    }

    /** @returns {HEX} */
    get hex() {
        return this.rgb.hex
    }
}

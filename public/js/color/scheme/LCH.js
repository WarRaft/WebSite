import {HSLUV} from './HSLUV.js'
import {HPLUV} from './HPLUV.js'
import {Chroma} from './utils/Chroma.js'
import {LUV} from './LUV.js'

export class LCH extends Chroma {
    l = 0
    c = 0
    h = 0

    get hsluv() {
        const hsluv = new HSLUV()

        if (this.l > 99.9999999) {
            hsluv.s = 0
            hsluv.l = 100
        } else if (this.l < 0.00000001) {
            hsluv.s = 0
            hsluv.l = 0
        } else {
            this.calculateBoundingLines(this.l)
            const max = this.calcMaxChromaHsluv(this.h)
            hsluv.s = this.c / max * 100
            hsluv.l = this.l
        }
        hsluv.h = this.h

        return hsluv
    }

    get hpluv() {
        const hpluv = new HPLUV()

        if (this.l > 99.9999999) {
            hpluv.p = 0
            hpluv.l = 100
        } else if (this.l < 0.00000001) {
            hpluv.p = 0
            hpluv.l = 0
        } else {
            this.calculateBoundingLines(this.l)
            const max = this.calcMaxChromaHpluv()
            hpluv.p = this.c / max * 100
            hpluv.l = this.l
        }
        hpluv.h = this.h

        return hpluv
    }

    get luv() {
        const luv = new LUV()

        const hrad = this.h / 180.0 * Math.PI
        luv.l = this.l
        luv.u = Math.cos(hrad) * this.c
        luv.v = Math.sin(hrad) * this.c

        return luv
    }
}

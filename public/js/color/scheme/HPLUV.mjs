import {Chroma} from './utils/Chroma.mjs'
import {LCH} from './LCH.mjs'

export class HPLUV extends Chroma {
    h = 0
    p = 0
    l = 0

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
            const max = this.calcMaxChromaHpluv()
            lch.c = max / 100 * this.p
        }
        lch.h = this.h

        return lch
    }

    get hex() {
        return this.lch.luv.xyz.rgb.hex
    }
}

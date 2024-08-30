import {LCH} from './LCH.js'
import {XYZ} from './XYZ.js'

const refY = 1.0
const kappa = 903.2962962
const refU = 0.19783000664283
const refV = 0.46831999493879
const lToY = L => L <= 8 ? refY * L / kappa : refY * Math.pow((L + 16) / 116, 3)

export class LUV {
    l = 0
    u = 0
    v = 0

    get lch() {
        const lch = new LCH()

        lch.l = this.l
        lch.c = Math.sqrt(this.u * this.u + this.v * this.v)
        if (lch.c < 0.00000001) {
            lch.h = 0
        } else {
            const hrad = Math.atan2(this.v, this.u)
            lch.h = hrad * 180.0 / Math.PI
            if (lch.h < 0) {
                lch.h = 360 + lch.h
            }
        }

        return lch
    }

    get xyz() {
        const xyz = new XYZ()

        if (this.l === 0) {
            xyz.x = 0
            xyz.y = 0
            xyz.z = 0
            return xyz
        }
        const varU = this.u / (13 * this.l) + refU
        const varV = this.v / (13 * this.l) + refV
        xyz.y = lToY(this.l)
        xyz.x = 0 - 9 * xyz.y * varU / ((varU - 4) * varV - varU * varV)
        xyz.z = (9 * xyz.y - 15 * varV * xyz.y - varV * xyz.x) / (3 * varV)

        return xyz
    }

}

import {LUV} from './LUV.mjs'
import {RGB} from './RGB.mjs'
import {LAB} from './LAB.mjs'

const epsilon = 0.0088564516
const refY = 1.0
const refU = 0.19783000664283
const refV = 0.46831999493879
const kappa = 903.2962962
const m_r0 = 3.240969941904521
const m_r1 = -1.537383177570093
const m_r2 = -0.498610760293
const m_g0 = -0.96924363628087
const m_g1 = 1.87596750150772
const m_g2 = 0.041555057407175
const m_b0 = 0.055630079696993
const m_b1 = -0.20397695888897
const m_b2 = 1.056971514242878

const yToL = Y => Y <= epsilon ? Y / refY * kappa : 116 * Math.pow(Y / refY, 1 / 3) - 16
const fromLinear = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055


export class XYZ {
    x = 0
    y = 0
    z = 0

    get luv() {
        const luv = new LUV()

        const divider = this.x + 15 * this.y + 3 * this.z
        let varU = 4 * this.x
        let varV = 9 * this.y
        if (divider !== 0) {
            varU /= divider
            varV /= divider
        } else {
            varU = NaN
            varV = NaN
        }
        luv.l = yToL(this.y)
        if (luv.l === 0) {
            luv.u = 0
            luv.v = 0
        } else {
            luv.u = 13 * luv.l * (varU - refU)
            luv.v = 13 * luv.l * (varV - refV)
        }

        return luv
    }

    get rgb() {
        const rgb = new RGB()

        rgb.r = fromLinear(m_r0 * this.x + m_r1 * this.y + m_r2 * this.z)
        rgb.g = fromLinear(m_g0 * this.x + m_g1 * this.y + m_g2 * this.z)
        rgb.b = fromLinear(m_b0 * this.x + m_b1 * this.y + m_b2 * this.z)

        return rgb
    }


    get lab() {
        let {x, y, z} = this

        x /= 0.94811
        z /= 1.07304

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

        const lab = new LAB()

        lab.l = 116 * y - 16
        lab.a = 500 * (x - y)
        lab.b = 200 * (y - z)

        return lab
    }
}

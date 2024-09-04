import {XYZ} from './XYZ.mjs'

export class LAB {
    l = 0
    a = 0
    b = 0

    get xyz() {
        let varY = (this.l + 16) / 116
        let varX = this.a / 500 + varY
        let varZ = varY - this.b / 200

        varY = Math.pow(varY, 3) > 0.008856 ? Math.pow(varY, 3) : (varY - 16 / 116) / 7.787
        varX = Math.pow(varX, 3) > 0.008856 ? Math.pow(varX, 3) : (varX - 16 / 116) / 7.787
        varZ = Math.pow(varZ, 3) > 0.008856 ? Math.pow(varZ, 3) : (varZ - 16 / 116) / 7.787

        const xyz = new XYZ()

        xyz.x = varX * 94.811
        xyz.y = varY * 100
        xyz.z = varZ * 107.304

        return xyz
    }

    /**
     * @return {number}
     */
    deltaE00(color) {
        const l1 = this.l
        const a1 = this.a
        const b1 = this.b
        const l2 = color.lab.l
        const a2 = color.lab.a
        const b2 = color.lab.b

        const rad2deg = rad => 360 * rad / (2 * Math.PI)
        const deg2rad = deg => (2 * Math.PI * deg) / 360

        // http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
        const avgL = (l1 + l2) / 2
        const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2))
        const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2))
        const avgC = (c1 + c2) / 2
        const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2

        const a1p = a1 * (1 + g)
        const a2p = a2 * (1 + g)

        const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2))
        const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2))

        const avgCp = (c1p + c2p) / 2

        let h1p = rad2deg(Math.atan2(b1, a1p))
        if (h1p < 0) h1p = h1p + 360

        let h2p = rad2deg(Math.atan2(b2, a2p))
        if (h2p < 0) h2p = h2p + 360

        const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2

        const t = 1 - 0.17 * Math.cos(deg2rad(avghp - 30)) + 0.24 * Math.cos(deg2rad(2 * avghp)) + 0.32 * Math.cos(deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(deg2rad(4 * avghp - 63))

        let deltahp = h2p - h1p
        if (Math.abs(deltahp) > 180) {
            if (h2p <= h1p) deltahp += 360
            else deltahp -= 360
        }

        const deltalp = l2 - l1
        const deltacp = c2p - c1p

        deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deg2rad(deltahp) / 2)

        const sl = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2))
        const sc = 1 + 0.045 * avgCp
        const sh = 1 + 0.015 * avgCp * t

        const deltaro = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2))
        const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)))
        const rt = -rc * Math.sin(2 * deg2rad(deltaro))

        const kl = 1
        const kc = 1
        const kh = 1

        return Math.sqrt(Math.pow(deltalp / (kl * sl), 2) + Math.pow(deltacp / (kc * sc), 2) + Math.pow(deltahp / (kh * sh), 2) + rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh)))
    }

}

const epsilon = 0.0088564516
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

const distanceFromOriginAngle = (slope, intercept, angle) => {
    const d = intercept / (Math.sin(angle) - slope * Math.cos(angle))
    return d < 0 ? Infinity : d
}

const distanceFromOrigin = (slope, intercept) => Math.abs(intercept) / Math.sqrt(Math.pow(slope, 2) + 1)

export class Chroma {
    calculateBoundingLines(l) {
        const sub1 = Math.pow(l + 16, 3) / 1560896
        const sub2 = sub1 > epsilon ? sub1 : l / kappa
        const s1r = sub2 * (284517 * m_r0 - 94839 * m_r2)
        const s2r = sub2 * (838422 * m_r2 + 769860 * m_r1 + 731718 * m_r0)
        const s3r = sub2 * (632260 * m_r2 - 126452 * m_r1)
        const s1g = sub2 * (284517 * m_g0 - 94839 * m_g2)
        const s2g = sub2 * (838422 * m_g2 + 769860 * m_g1 + 731718 * m_g0)
        const s3g = sub2 * (632260 * m_g2 - 126452 * m_g1)
        const s1b = sub2 * (284517 * m_b0 - 94839 * m_b2)
        const s2b = sub2 * (838422 * m_b2 + 769860 * m_b1 + 731718 * m_b0)
        const s3b = sub2 * (632260 * m_b2 - 126452 * m_b1)
        this.r0s = s1r / s3r
        this.r0i = s2r * l / s3r
        this.r1s = s1r / (s3r + 126452)
        this.r1i = (s2r - 769860) * l / (s3r + 126452)
        this.g0s = s1g / s3g
        this.g0i = s2g * l / s3g
        this.g1s = s1g / (s3g + 126452)
        this.g1i = (s2g - 769860) * l / (s3g + 126452)
        this.b0s = s1b / s3b
        this.b0i = s2b * l / s3b
        this.b1s = s1b / (s3b + 126452)
        this.b1i = (s2b - 769860) * l / (s3b + 126452)
    }

    calcMaxChromaHsluv(h) {
        const hueRad = h / 360 * Math.PI * 2
        const r0 = distanceFromOriginAngle(this.r0s, this.r0i, hueRad)
        const r1 = distanceFromOriginAngle(this.r1s, this.r1i, hueRad)
        const g0 = distanceFromOriginAngle(this.g0s, this.g0i, hueRad)
        const g1 = distanceFromOriginAngle(this.g1s, this.g1i, hueRad)
        const b0 = distanceFromOriginAngle(this.b0s, this.b0i, hueRad)
        const b1 = distanceFromOriginAngle(this.b1s, this.b1i, hueRad)
        return Math.min(r0, r1, g0, g1, b0, b1)
    }

    calcMaxChromaHpluv() {
        const r0 = distanceFromOrigin(this.r0s, this.r0i)
        const r1 = distanceFromOrigin(this.r1s, this.r1i)
        const g0 = distanceFromOrigin(this.g0s, this.g0i)
        const g1 = distanceFromOrigin(this.g1s, this.g1i)
        const b0 = distanceFromOrigin(this.b0s, this.b0i)
        const b1 = distanceFromOrigin(this.b1s, this.b1i)
        return Math.min(r0, r1, g0, g1, b0, b1)
    }
}

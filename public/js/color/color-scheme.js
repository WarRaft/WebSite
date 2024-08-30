import {HSLUV} from './scheme/HSLUV.js'

export class ColorScheme {

    /**
     * @param {number} index
     */
    constructor(index) {
        this.index = index

        for (const [k, v] of Object.entries(window.themeColor)) {
            this.colors[k] = v[index]
        }
    }

    colors = {}

    /**
     * @param {string} name
     * @param {string} hex
     */
    setColor(name, hex) {
        const isDark = this.index === 1

        switch (name) {
            case 'background':
                const background = HSLUV.fromHexString(hex)
                this.colors.background = background.hex.toString()

                const block = background.clone
                block.l += block.l > 10 ? -10 : 10
                this.colors.blockBackground = block.hex.toString()

                const color = block.clone
                color.l += color.l > 50 ? -50 : 50
                this.colors.color = color.hex.toString()

                this.colors.muted = color.rgb.blend(block.rgb, isDark ? .7 : .54).hex.toString()


        }

        for (const [k, v] of Object.entries(this.colors)) {
            window.themeColor[k][this.index] = v
        }

        window.PrefersColorScheme.save()
    }
}


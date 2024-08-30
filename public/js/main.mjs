import './color/day-night.js'

import {ColorScheme} from './color/color-scheme.js'

const light = new ColorScheme(0)
const dark = new ColorScheme(1)

// https://gist.github.com/mjackson/5311256

// theme-color-input
addEventListener('input', e => {
    const scheme = window.PrefersColorScheme.get() === 'dark' ? dark : light
    if (e.target.type === 'color' && e.target.dataset.name !== null) scheme.setColor(e.target.dataset.name, e.target.value)
})



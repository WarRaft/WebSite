import './color/day-night.mjs'

import {ColorScheme} from './color/color-scheme.mjs'
import {DayNight} from "./color/day-night.mjs";

const light = new ColorScheme(0)
const dark = new ColorScheme(1)

// https://gist.github.com/mjackson/5311256
addEventListener('input', e => {
    const scheme = window.PrefersColorScheme.get() === 'dark' ? dark : light
    if (e.target.type === 'color' && e.target.dataset.name !== null) scheme.setColor(e.target.dataset.name, e.target.value)
})

const d = new DayNight()

document.body.appendChild(d)

const i = document.createElement('input')
i.type = 'color'
i.classList.add('theme-color-input')
i.dataset.name = 'background'
document.body.appendChild(i)
setThemeColorInput()

console.log(location.pathname)

// router


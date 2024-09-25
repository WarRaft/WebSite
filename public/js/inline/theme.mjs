const themeKey = 'prefers-color-scheme'
const themeDataKey = 'theme-data'
const themeForm = /** @type {HTMLCollectionOf<HTMLFormElement>} */ document.getElementsByClassName('theme-form')
const themeRadio = /** @type {HTMLCollectionOf<HTMLInputElement>} */ document.getElementsByClassName('theme-form-radio')
const themeColorInput = /** @type {HTMLCollectionOf<HTMLInputElement>} */ document.getElementsByClassName('theme-color-input')

const setTheme = (theme, save) => {
    const d = document.documentElement
    d.classList.remove('light', 'dark')
    d.classList.add(theme)
    d.style.setProperty('--color-scheme', theme)
    if (save) localStorage.setItem(themeKey, theme)
}

const setThemeRadio = () => {
    let theme = 'no-preference'
    if (PrefersColorScheme.has()) theme = PrefersColorScheme.get()
    for (const input of themeRadio) {
        input.checked = input.value === theme
    }
}

const themeColorDefault = {
    background: ['#cccccc', '#18191a'],
    blockBackground: ['#e7e7e7', '#2a2c2c'],
    color: ['#000000', '#E4E6EB'],
    muted: ['#888888', '#7e7f83'],
}

window.themeColor = structuredClone(themeColorDefault)

let themeObj
try {
    themeObj = JSON.parse(localStorage.getItem(themeDataKey))
    for (const [k, v] of Object.entries(themeObj)) {
        if (!Array.isArray(v) || v.length !== 2) continue
        themeColor[k][0] = v[0]
        themeColor[k][1] = v[1]
    }
} catch (_) {
    //console.error('Theme data parse error!')
}

function setThemeColorInput() {
    const k = PrefersColorScheme.get() === 'dark' ? 1 : 0
    for (const input of themeColorInput) {
        const name = input.dataset.name
        if (!themeColor[name]) continue
        input.value = themeColor[name][k]
    }
}

window.PrefersColorScheme = {
    has: () => !!localStorage.getItem(themeKey),
    /** @returns {'light'|'dark'} */
    get: () => {
        const theme = localStorage.getItem(themeKey)
        if (theme === 'light' || theme === 'dark') return theme
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        }
        return 'light'
    },
    /** @param {'light'|'dark'} theme */
    set: theme => {
        switch (theme) {
            case 'light':
            case 'dark':
                return setTheme(theme, true)
            default:
                localStorage.removeItem(themeKey)
                setTheme(PrefersColorScheme.get(), false)
        }
    },
    redraw: () => {
        const index = PrefersColorScheme.get() === 'dark' ? 1 : 0
        for (const [k, v] of Object.entries(themeColor)) {
            document.documentElement.style.setProperty(`--${k}`, v[index])
        }
    },
    save: () => {
        setThemeColorInput()
        PrefersColorScheme.redraw()
        localStorage.setItem(themeDataKey, JSON.stringify(window.themeColor))
    },

    toggle: () => {
        let theme = PrefersColorScheme.get()
        if (theme === 'light') theme = 'dark'
        else if (theme === 'dark') theme = 'light'
        setTheme(theme, true)
        for (const input of themeRadio) {
            input.checked = input.value === theme
        }
        PrefersColorScheme.redraw()
        setThemeRadio()
        setThemeColorInput()
    }
}

setTheme(PrefersColorScheme.get())

PrefersColorScheme.redraw()

addEventListener('DOMContentLoaded', () => {
    setThemeRadio()
    setThemeColorInput()
    for (const form of themeForm) {
        form.addEventListener('change', e => {
            PrefersColorScheme.set(e.target.value)
            PrefersColorScheme.redraw()
        })
    }

    document.querySelectorAll('.theme-reset').forEach(b => b.addEventListener('click', () => {
        window.themeColor = structuredClone(themeColorDefault)
        localStorage.removeItem(themeDataKey)
        PrefersColorScheme.redraw()
        setThemeColorInput()
    }))
})

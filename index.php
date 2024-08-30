<!DOCTYPE html>
<html lang="ru">
<head>
    <base href="xgm-next">

    <title>WarRaft</title>
    <meta name="description" content="Make XGM great again!">

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="manifest" href="site.webmanifest">
    <meta name="msapplication-config" content="browserconfig.xml">

    <link rel="apple-touch-icon" sizes="180x180" href="public/images/icons/app/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="public/images/icons/app/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="public/images/icons/app/favicon-16x16.png">
    <link rel="mask-icon" href="public/images/icons/app/safari-pinned-tab.svg" color="#5bbad5">

    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <meta http-equiv="Content-Security-Policy"
          content="default-src 'self'; worker-src 'self'; style-src 'self' 'unsafe-inline' ; script-src 'self' 'nonce-rAnd0m' 'sha256-C9Pc74x5BP660fRg4HJ6AmFM9IpoprZO7TSDFKmjYzw=';">

    <meta property="og:site_name" content="XGM - Next"/>
    <meta property="og:title" content="Make XGM great again!"/>
    <meta name="twitter:title" content="Make XGM great again!"/>
    <meta name="description" content="Делаем новый современный дизайн для XGM!"/>
    <meta property="og:description" content="Делаем новый современный дизайн для XGM!"/>
    <meta name="twitter:description" content="Делаем новый современный дизайн для XGM!"/>
    <meta property="og:image:alt" content="Делаем новый современный дизайн для XGM!"/>
    <meta property="og:type" content="object"/>
    <meta property="og:url" content="https://nazarpunk.github.io/xgm-next/"/>
    <meta property="og:image"
          content="https://raw.githubusercontent.com/nazarpunk/xgm-next/master/images/opengraph/repository-open-graph-template.png"/>
    <meta name="twitter:image:src"
          content="https://raw.githubusercontent.com/nazarpunk/xgm-next/master/images/opengraph/repository-open-graph-template.png"/>
    <meta name="twitter:card" content="summary_large_image"/>

    <link rel="stylesheet" href="./public/css/main.css">
    <script src="./public/js/main.mjs" type="module" defer></script>
    <script nonce="rAnd0m">
        navigator.serviceWorker
            .register('./sw.js', {scope: './'})
            .then(reg => {
                if (0) console.log('Registration succeeded. Scope is ' + reg.scope)
            })
            .catch(error => {
                console.log('Registration failed with ' + error)
            })
    </script>
    <script nonce="rAnd0m">
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

    </script>
</head>
<body>
<!-- https://www.w3.org/TR/2013/CR-html5-20130806/sections.html#the-article-element -->
<header class="main-header block">
    <h1>Шапка</h1>
    <day-night></day-night>
</header>
<aside class="main-sidemenu block">
    <h1>Меню</h1>
    <form class="theme-form">
        <div>
            <label>
                <input type="radio" class="theme-form-radio" name="theme-form-radio" value="light" autocomplete="off">
                Светлая тема
            </label>
        </div>
        <div>
            <label>
                <input type="radio" class="theme-form-radio" name="theme-form-radio" value="dark" autocomplete="off">
                Тёмная тема
            </label>
        </div>
        <div>
            <label>
                <input type="radio" class="theme-form-radio" name="theme-form-radio" value="no-preference"
                       autocomplete="off">
                Авто тема
            </label>
        </div>
    </form>
    <br>
    <button type="button" class="theme-reset">Цвета по умолчанию</button>
</aside>
<main class="main-content block">
    <h1>Контент</h1>
    <h2>Фон и цвет текста</h2>
    <p>Пожалуй самая важная пара цветов, которая, как и ковёр, задаёт стиль всему сайту.</p>
    <p>Так как наша задача не дать пользователю нарулить вырвиглазное нечто, то мы воспользуемся
        <a href="https://www.hsluv.org/">HSLuv</a>,
        который, по заявлению авторов более дружественный к <strike>кожаным мешкам</strike> людям.</p>
    <p class="text-muted">Часто необходимая вещь, это затенёный текст, который в простонародии прозвали <b>muted</b>.
        Обычно, всякие косорукие макаки делают его через прозрачность. Но мы будем умнее и просто смешаем два цвета.
    </p>
    <p class="text-muted">Коэфициент смешивания отличается для светлой и тёмной темы, так что эксперемнтируйте на
        здоровье.</p>

    <h4>Генерация</h4>
    <p>Для того, чтоб сгенерировать цвета, нужен базовый цвет, вокруг которого будет строиться вся магия.</p>

    <p>
        <label>
            <input type="color" class="theme-color-input" data-name="background">
            Фон сайта
        </label>
        <label>
            <input type="color" class="theme-color-input" data-name="background-block">
            Фон блока
        </label>
        <label>
            <input type="color" class="theme-color-input" data-name="color">
            Цвет текста
        </label>
    </p>
</main>
<section class="main-comments block"><h1>Комментарии</h1></section>
<footer class="main-footer block"><h1>Подвал</h1></footer>

</body>
</html>

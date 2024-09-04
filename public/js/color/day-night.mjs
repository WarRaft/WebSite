// noinspection JSUnusedGlobalSymbols

export class DayNight extends HTMLElement {
    static #sheet

    constructor() {
        super().attachShadow({mode: 'open'})
        this.shadowRoot.adoptedStyleSheets = [DayNight.sheet]
    }

    /** @type {MutationObserver} */ themeObserver

    connectedCallback() {
        const container = document.createElement('div')
        container.classList.add('container')

        this.shadowRoot.appendChild(container)

        container.innerHTML = '<div class="slider round"><div class="background"></div><div class="star"></div><div class="star"></div></div>'

        this.shadowRoot.addEventListener('click', window.PrefersColorScheme.toggle)


        const redraw = () => container.classList.toggle('dark', document.documentElement.classList.contains('dark'))

        this.themeObserver = new MutationObserver(mutationList => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    redraw()
                }
            }
        })
        this.themeObserver.observe(document.documentElement, {attributes: true})

        redraw()
    }


    disconnectedCallback() {
        this.themeObserver.disconnect()
    }

    static get sheet() {
        if (DayNight.#sheet) return DayNight.#sheet
        DayNight.#sheet = new CSSStyleSheet()

        // https://www.cssscript.com/creative-animated-toggle-switch/
        // noinspection CssUnusedSymbol
        DayNight.sheet.replaceSync(
            //language=CSS
            `*, *::before, *::after {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            :host {
                --sun: #ffd700;
                --sun-shadow: #987416;
                --moon: #dddddd;
                --moon-shadow: #808080;
                --star: #ffffff;
                --cloud: #ffffff;
                --crater: #535370;
                --shadow-01: #80808077;
                --shadow-02: #ffffff22;
                --shadow-03: #555555;

                --slider-bg: linear-gradient(#87ceeb, #5f9ea0);

                cursor: pointer;
                display: inline-block;
                width: 80px;
                height: 34px;
            }

            .dark {
                --slider-bg: linear-gradient(-45deg, #222, #000030);
            }
            
            .container {
                position: relative;
                width: 100%;
                height: 100%;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                inset: 0;
                background: var(--slider-bg);
                transition: 0.4s;
                overflow: hidden;
                z-index: 1;
                pointer-events: none;
                border-radius: 34px;
            }
            .slider::before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: var(--sun);
                transition: 0.4s;
                box-shadow: inset 0 -1px 2px var(--sun-shadow),
                0 1px 2px var(--shadow-01),
                0 0 0 10px var(--shadow-02),
                0 0 0 20px var(--shadow-02),
                10px 0 0 20px var(--shadow-02);
                border-radius: 50%;
            }

            .dark .slider:before {
                background: var(--moon);
                transform: translateX(180%);
                box-shadow: inset 0 -1px 2px var(--moon-shadow),
                0 1px 2px var(--shadow-03),
                0 0 0 10px var(--shadow-02),
                0 0 0 20px var(--shadow-02),
                -10px 0 0 20px var(--shadow-02);
            }

            .slider::after {
                content: "";
                position: absolute;
                background: var(--crater);
                width: 4px;
                height: 4px;
                border-radius: 50%;
                bottom: 65%;
                right: 16%;
                box-shadow: -8px 7px 0 3px var(--crater),
                2px 10px 0 var(--crater);
                transition: .4s;
                transform: scale(0) rotate(360deg);
                filter: saturate(.75);
            }

            .dark .slider::after {
                transform: scale(1) rotate(-24deg);
            }

            .star {
                transform: scale(0);
                transition: .4s;
            }

            .background {
                position: absolute;
                width: 10px;
                height: 10px;
                background: var(--cloud);
                border-radius: 50%;
                bottom: 0;
                right: 0;
                box-shadow: 0 -10px 0 8px var(--cloud),
                -10px 0 0 8px var(--cloud),
                -45px 4px 0 5px var(--cloud),
                -60px 0 0 3px var(--cloud),
                -29px 2px 0 8px var(--cloud);
                transition: .4s;
            }

            .dark .background {
                transform: translateY(260%);
                opacity: 0;
            }

            /* dark */
            .dark .star {
                position: absolute;
                width: 0;
                height: 0;
                border: 10px solid transparent;
                border-bottom: 7px solid var(--star);
                border-top: none;
                margin: 5px 0;
                transform: scale(.3) translate(50%);
            }
            .dark .star:last-child {
                transform: scale(.4) translate(225%, 300%);
            }
            .dark .star::before,
            .dark .star::after {
                content: "";
                position: absolute;
                width: 0;
                height: 0;
                border-top: none;
            }
            .dark .star::before {
                border: 3px solid transparent;
                border-bottom: 8px solid var(--star);
                transform: rotate(35deg);
                top: -7.5px;
                left: 2px;
            }
            .dark .star::after {
                border: 10px solid transparent;
                border-bottom: 7px solid var(--star);
                transform: rotate(70deg);
                top: -7px;
                left: -4.5px;
            }
            `)

        return DayNight.#sheet
    }
}

customElements.define('day-night', DayNight)

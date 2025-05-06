use crate::token::token_gen;
use maud::{DOCTYPE, Markup, PreEscaped, html};
use std::{env, fs};

pub fn render() -> Markup {
    let nonce = token_gen(16);
    //let cache = token_gen(16);

    /*
    <?= Html::og(
        title: 'WarRaft',
        description: 'WebSite for WarRaft community!',
        image: 'https://warraft.org/public/images/opengraph/repository-open-graph-template.png'
    ) ?>
     */
    html! {
        (DOCTYPE)
        html lang="ru" {
            head {
                meta charset="UTF-8";
                meta name="viewport" content="width=device-width, initial-scale=1";

                link rel="manifest" href="/cache-2/site.webmanifest";
                meta name="msapplication-config" content="/cache-1/browserconfig.xml";

                link rel="apple-touch-icon" sizes="180x180" href="/cache-2/images/icons/app/apple-touch-icon.png";
                link rel="icon" type="image/png" sizes="32x32" href="/cache-2/images/icons/app/favicon-32x32.png";
                link rel="icon" type="image/png" sizes="16x16" href="/cache-2/images/icons/app/favicon-16x16.png";
                link rel="mask-icon" href="/cache-2/images/icons/app/safari-pinned-tab.svg" color="#5bbad5";

                link rel="stylesheet" href="css/main.css";
                link rel="mask-icon" href="images/icons/app/safari-pinned-tab.svg" color="#5bbad5";
                meta name="msapplication-TileColor" content="#da532c";
                meta name="theme-color" content="#ffffff";

                meta http-equiv="Content-Security-Policy" content=(format!("default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline';"));

                (script_inline("sw.mjs", &nonce))
                (script_inline("theme.mjs", &nonce))

                script type="module" defer src="js/main.mjs" {}
            }
            body {
                header class="main-header block" {
                    h1 { "Шапка" }
                    (PreEscaped("<day-night></day-night>"))
                }
                aside class="main-sidemenu block" {
                    h1 { "Меню" }
                    form class="theme-form" {
                        @for (value, label) in &[("light", "Светлая тема"), ("dark", "Тёмная тема"), ("no-preference", "Авто тема")] {
                            div {
                                label {
                                    input type="radio" class="theme-form-radio" name="theme-form-radio" value=(value) autocomplete="off";
                                    (label)
                                }
                            }
                        }
                    }
                    br;
                    button type="button" class="theme-reset" { "Цвета по умолчанию" }
                }
                main class="main-content block" {
                    h1 { "Контент1" }
                    h2 { "Фон и цвет текста" }
                    p { "Пожалуй самая важная пара цветов, которая, как и ковёр, задаёт стиль всему сайту." }
                    p {
                        "Так как наша задача не дать пользователю нарулить вырвиглазное нечто, то мы воспользуемся "
                        a href="https://www.hsluv.org/" { "HSLuv" }
                        ", который, по заявлению авторов более дружественный к "
                        (PreEscaped("<strike>кожаным мешкам</strike>")) " людям."
                    }
                    p class="text-muted" {
                        "Часто необходимая вещь, это затенёный текст, который в простонародии прозвали "
                        b { "muted" }
                        ". Обычно, всякие косорукие макаки делают его через прозрачность. Но мы будем умнее и просто смешаем два цвета."
                    }
                    p class="text-muted" {
                        "Коэфициент смешивания отличается для светлой и тёмной темы, так что эксперемнтируйте на здоровье."
                    }

                    h4 { "Генерация" }
                    p { "Для того, чтоб сгенерировать цвета, нужен базовый цвет, вокруг которого будет строиться вся магия." }

                    p {
                        @for (name, label) in &[("background", "Фон сайта"), ("background-block", "Фон блока"), ("color", "Цвет текста")] {
                            label {
                                input type="color" class="theme-color-input" data-name=(name);
                                (label)
                            }
                        }
                    }
                }
                section class="main-comments block" {
                    h1 { "Комментарии" }
                }
                footer class="main-footer block" {
                    h1 { "Подвал" }
                }
            }
        }
    }
}

fn script_inline(rel_path: &str, nonce: &str) -> Markup {
    let path = env::current_exe()
        .expect("Failed to get current executable path")
        .parent()
        .expect("Executable must be in a directory")
        .to_path_buf()
        .parent()
        .unwrap()
        .join("public")
        .join("js")
        .join("inline")
        .join(rel_path);

    let content = fs::read_to_string(&path)
        .unwrap_or_else(|_| format!("console.error('Failed to read {}');", path.display()));

    html! {
        script type="text/javascript" nonce=(nonce) {
            (PreEscaped(content))
        }
    }
}

use crate::token::token_gen;
use maud::{DOCTYPE, Markup, PreEscaped, html};
use std::{env, fs};

pub fn render() -> Markup {
    let nonce = token_gen(16);
    let cache = token_gen(10);

    /*
        title: 'WarRaft',
        description: 'WebSite for WarRaft community!',
        image: 'https://warraft.org/public/images/opengraph/repository-open-graph-template.png'
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

                meta name="msapplication-TileColor" content="#da532c";
                meta name="theme-color" content="#ffffff";

                meta http-equiv="Content-Security-Policy" content=(format!("default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline';"));

                (script_inline("sw.mjs", &nonce))
                (script_inline("theme.mjs", &nonce))

                link rel="stylesheet" href=(format!("/cache-{cache}/css/main.css"));
                script type="module" defer src=(format!("/cache-{cache}/js/main.mjs")) {}
            }
            body {}
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

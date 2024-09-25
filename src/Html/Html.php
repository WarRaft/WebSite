<?php

namespace Html;

class Html
{
    public static function nonce(): string
    {
        static $nonce;
        return $nonce ??= bin2hex(openssl_random_pseudo_bytes(32));
    }

    public static function inlineJs(string $path): string
    {
        $out = "<script nonce='" . Html::nonce() . "'>" . chr(10);

        $p = "{$_SERVER['DOCUMENT_ROOT']}/public/js/inline/$path";
        if (is_readable($p)) {
            $out .= file_get_contents($p);
        } else {
            $out .= "// Errror: $p";
        }

        $out .= '</script>';
        return $out;
    }

    public static function og(
        ?string $title = null,
        ?string $description = null,
        ?string $image = null,
        ?string $url = null,
    ): string
    {

        // https://ogp.me/#types

        $out = <<<EOF
<meta name="twitter:site" content="@WarRaft"/>
<meta property="og:site_name" content="WarRaft"/>
<meta property="og:type" content="object"/>
<meta name="twitter:card" content="summary_large_image"/>
EOF;

        if ($url !== null) {
            $out .= <<<EOF
<meta property="og:url" content="https://warraft.org"/>
EOF;
        }

        if ($title !== null) {
            $content = htmlspecialchars($title);
            $out .= <<<EOF
<title>$content</title>
<meta property='og:title' content='$content'/>
<meta name='twitter:title' content='$content'/>
EOF;
        }

        if ($description !== null) {
            $content = htmlspecialchars($description);
            $out .= <<<EOF
<meta name='description' content='$content'>
<meta property='og:description' content='$content'/>
<meta name='twitter:description' content='$content'/>            
EOF;
        }

        if ($image !== null) {
            $out .= <<<EOF
<meta property="og:image" content="$image"/>
<meta name="twitter:image" content="$image"/>
EOF;

            if ($description !== null) {
                $out .= <<<EOF
<meta property='og:image:alt' content='$content'/>            
EOF;
            }
        }

        return $out;
    }

}

<?php
declare(strict_types=1);

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

use Html\Html;

require_once 'src/autoloader.php';

$cache = time();
//$cache = 3;

?><!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="manifest" href="site.webmanifest">
    <meta name="msapplication-config" content="browserconfig.xml">

    <link rel="apple-touch-icon" sizes="180x180" href="public/images/icons/app/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="public/images/icons/app/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="public/images/icons/app/favicon-16x16.png">
    <link rel="mask-icon" href="public/images/icons/app/safari-pinned-tab.svg" color="#5bbad5">

    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="public/images/icons/app/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <meta http-equiv="Content-Security-Policy"
          content="default-src 'self'; worker-src 'self'; style-src 'self' 'unsafe-inline' ; script-src 'self' 'nonce-<?= Html::nonce() ?>';">

    <?= Html::og(
        title: 'WarRaft',
        description: 'WebSite for WarRaft community!',
        image: 'https://warraft.org/public/images/opengraph/repository-open-graph-template.png'
    ) ?>

    <link rel="stylesheet" href="/public/<?= $cache ?>/css/main.css">
    <script src="/public/<?= $cache ?>/js/main.mjs" type="module" defer></script>

    <?= Html::inlineJs('sw.mjs') ?>
    <?= Html::inlineJs('theme.mjs') ?>
</head>
<body>
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

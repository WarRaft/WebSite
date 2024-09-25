<?php
declare(strict_types=1);

function autoloader(string $class): void
{
    $class = str_replace('\\', '/', $class);
    $file = dirname(__FILE__) . "/$class.php";
    if (is_readable($file)) {
        require_once $file;
    }
}

spl_autoload_register('autoloader');

//require_once 'vendor/autoload.php';

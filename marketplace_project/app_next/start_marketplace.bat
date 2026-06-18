@echo off
chcp 65001 > nul
title Запуск DigitalHubUz

echo ===================================================
echo     ЗАПУСК DIGITALHUBUZ MARKETPLACE
echo ===================================================
echo.
echo [!] ВАЖНО: Убедитесь, что в программе Laragon 
echo     нажата кнопка "Start All" (Запустить всё).
echo.
echo [..] Запуск Next.js сервера...

set PATH=C:\laragon\bin\nodejs\node-v22;%PATH%
cd /d "c:\Users\hasan\OneDrive\Desktop\mk\marketplace_project\app_next"

echo [..] Открытие сайта в браузере...
start http://localhost/

npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [Ошибка] Не удалось запустить сервер. Проверьте текст ошибки выше.
    pause
)

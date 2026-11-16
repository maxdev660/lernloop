@echo off
setlocal
cd /d "%~dp0"
echo [1/3] Tests ausfuehren ...
call npm.cmd run test
if errorlevel 1 goto fail
echo [2/3] Website bauen ...
call npm.cmd run build
if errorlevel 1 goto fail
echo [3/3] GitHub und Cloudflare aktualisieren ...
if exist .git\ (
  git add .
  git diff --cached --quiet
  if errorlevel 1 (
    git commit -m "lernloop aktualisiert"
    if errorlevel 1 goto fail
  )
  git push
  if errorlevel 1 goto fail
)
call npx.cmd wrangler pages deploy dist --project-name=lernloop --branch=main
if errorlevel 1 goto fail
echo Website aktualisiert: https://lernloop.pages.dev/
exit /b 0
:fail
echo ABBRUCH: Ein Schritt ist fehlgeschlagen. Cloudflare ggf. nicht aktualisiert.
exit /b 1

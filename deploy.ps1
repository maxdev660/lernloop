# lernloop. – Aus F:\lernloop ausfuehren. Existierendes .git-Verzeichnis beibehalten.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host '1/3 – Website pruefen und bauen...' -ForegroundColor Cyan
npm.cmd run test
if ($LASTEXITCODE -ne 0) { throw 'Tests fehlgeschlagen. Kein Deployment.' }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build fehlgeschlagen. Kein Deployment.' }
Write-Host '2/3 – GitHub synchronisieren...' -ForegroundColor Cyan
if (Test-Path '.git') {
  git add .
  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git commit -m "lernloop aktualisiert"
    if ($LASTEXITCODE -ne 0) { throw 'Git Commit fehlgeschlagen.' }
  }
  git push
  if ($LASTEXITCODE -ne 0) { throw 'Git Push fehlgeschlagen. Cloudflare nicht aktualisiert.' }
} else { Write-Host 'Kein .git gefunden; GitHub-Schritt uebersprungen.' -ForegroundColor Yellow }
Write-Host '3/3 – Auf bestehendes Cloudflare-Pages-Projekt laden...' -ForegroundColor Cyan
npx.cmd wrangler pages deploy dist --project-name=lernloop --branch=main
if ($LASTEXITCODE -ne 0) { throw 'Cloudflare Deployment fehlgeschlagen.' }
Write-Host 'Fertig. https://lernloop.pages.dev/' -ForegroundColor Green

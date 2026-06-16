# Gastos - VitalHood | Inicia API + frontend
$NodeDir = "C:\Program Files\nodejs"

if (-not (Test-Path "$NodeDir\npm.cmd")) {
    Write-Host "ERROR: Node.js no esta instalado." -ForegroundColor Red
    Read-Host "Presiona Enter para cerrar"
    exit 1
}

$env:Path = "$NodeDir;" + $env:Path
Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Cyan
    & "$NodeDir\npm.cmd" install
}

Write-Host ""
Write-Host "Iniciando API (3001) + Frontend (5173)..." -ForegroundColor Green
Write-Host "Abre http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
& "$NodeDir\npm.cmd" run dev:all

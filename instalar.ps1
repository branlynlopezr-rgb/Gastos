# Gastos - VitalHood | Solo instalar dependencias
$NodeDir = "C:\Program Files\nodejs"

if (-not (Test-Path "$NodeDir\npm.cmd")) {
    Write-Host "ERROR: Node.js no esta instalado. Descargalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

$env:Path = "$NodeDir;" + $env:Path
Set-Location $PSScriptRoot

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
& "$NodeDir\npm.cmd" install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Listo. Ejecuta .\iniciar.ps1 para abrir el proyecto." -ForegroundColor Green
} else {
    Write-Host "Hubo un error durante la instalacion." -ForegroundColor Red
}

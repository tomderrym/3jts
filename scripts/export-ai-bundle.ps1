# AppMonster AI bundle export (Windows)
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path "node_modules\archiver")) {
    Write-Host "Installing archiver (npm install)…"
    npm install
}

Write-Host "Running AI export bundle…"
node scripts/export-ai-bundle.js

Write-Host ""
Write-Host "Output:"
Write-Host "  $((Get-Location).Path)\appmonster-ai-export\"
Write-Host "  $((Get-Location).Path)\appmonster-ai-export.zip"

# Runs backend (uvicorn) and frontend (Vite) in separate PowerShell windows
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$backendCmd = "cd `"$root\backend`"; uvicorn main:app --reload"
$frontendCmd = "cd `"$root\frontend`"; npm run dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

@echo off
setlocal
set ROOT=%~dp0

start cmd /k "cd /d %ROOT%backend && uvicorn main:app --reload"
start cmd /k "cd /d %ROOT%frontend && npm run dev"

endlocal

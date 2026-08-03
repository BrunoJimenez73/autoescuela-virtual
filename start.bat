@echo off
cd /d "%~dp0"

echo ========================================
echo  Autoescuela Virtual - Inicio
echo ========================================
echo.

:: Matar procesos previos en puertos 3001 y 5173
echo Cerrando procesos previos...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    if not "%%a"=="" taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    if not "%%a"=="" taskkill /f /pid %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: Arrancar servidor
echo [1/2] Arrancando servidor API (puerto 3001)...
start "Autoescuela Server" cmd /c "cd /d %~dp0server && npx tsx src/index.ts"

:: Esperar a que el servidor esté listo
echo Esperando al servidor...
:wait
timeout /t 2 /nobreak >nul
netstat -an 2>nul | findstr ":3001" >nul
if errorlevel 1 goto wait

:: Arrancar cliente
echo [2/2] Arrancando cliente (puerto 5173)...
start "Autoescuela Client" cmd /c "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo  Servidor: http://localhost:3001
echo  Cliente:  http://localhost:5173
echo ========================================
echo.
pause

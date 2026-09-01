@echo off
REM ════════════════════════════════════════════════════════════════
REM    🎮 VALE DE AURORA - INICIALIZADOR WINDOWS
REM
REM    Script para iniciar o jogo no Windows
REM ════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          🎮 BEM-VINDO AO VALE DE AURORA 🎮                   ║
echo ║                                                                ║
echo ║     Escolha sua versão para iniciar a aventura:               ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo   [1] ⚡ Vanilla JavaScript (imediato, sem instalação)
echo   [2] 🚀 React + Vite (moderno, após instalação)
echo   [3] 📊 Verificar instalação
echo   [4] ❌ Sair
echo.

set /p choice="Escolha uma opção (1-4): "

if "%choice%"=="1" goto vanilla
if "%choice%"=="2" goto react
if "%choice%"=="3" goto verify
if "%choice%"=="4" goto exit
goto invalid

:vanilla
echo.
echo 🚀 Iniciando Vanilla JavaScript...
echo.

set PORT=8000

echo 📂 Diretório: %CD%
echo 🌐 Servidor: http://localhost:%PORT%
echo 🎮 Game: http://localhost:%PORT%/index.html
echo.
echo 💡 Dica: Abra http://localhost:%PORT%/index.html no navegador
echo ⚠️  Pressione Ctrl+C para parar o servidor
echo.

REM Tentar abrir no navegador
start http://localhost:%PORT%/index.html 2>nul

REM Iniciar servidor Python
python -m http.server %PORT% 2>nul || python3 -m http.server %PORT%

goto end

:react
echo.
echo 🚀 Iniciando React + Vite...
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Por favor, instale Node.js 16 ou superior.
    echo    Visite: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm não encontrado. Por favor, instale npm.
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version
echo ✅ npm: 
npm --version
echo.

REM Verificar se react-app existe
if not exist "react-app" (
    echo ❌ Diretório react-app não encontrado!
    echo    Por favor, certifique-se de que você está no diretório correto.
    pause
    exit /b 1
)

cd react-app

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependências...
    echo    ^(Isso pode levar 2-3 minutos na primeira vez^)
    echo.
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erro durante a instalação de dependências
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Dependências instaladas com sucesso!
) else (
    echo ✅ Dependências já instaladas
)

echo.
echo 🎮 Iniciando servidor de desenvolvimento...
echo 🌐 Acesse: http://localhost:3000
echo ⚠️  Pressione Ctrl+C para parar o servidor
echo.

call npm run dev

goto end

:verify
echo.
echo 🔍 Verificando instalação...
echo.

if exist "verify-installation.sh" (
    REM No Windows, precisamos de Git Bash ou WSL para executar scripts bash
    echo ⚠️  Script bash requer Git Bash ou WSL no Windows.
    echo    Executando com Git Bash se disponível...
    echo.
    
    where bash >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        bash verify-installation.sh
    ) else (
        echo ❌ Git Bash não encontrado. 
        echo    Por favor, instale Git for Windows (com Git Bash).
        echo    Ou use WSL: wsl bash verify-installation.sh
    )
) else (
    echo ❌ Script de verificação não encontrado!
)

pause
goto end

:invalid
echo.
echo ❌ Opção inválida. Por favor, escolha 1, 2, 3 ou 4.
echo.
pause
goto end

:exit
echo.
echo 👋 Até logo! Bom jogo! 🎮
echo.
pause

:end
endlocal

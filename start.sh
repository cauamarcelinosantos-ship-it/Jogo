#!/bin/bash

##############################################################################
#                                                                            #
#   🎮 VALE DE AURORA - SCRIPT DE INICIALIZAÇÃO                            #
#                                                                            #
#   Este script executa o jogo em sua versão preferida:                   #
#   1. Vanilla JavaScript (sem dependências)                              #
#   2. React + Vite (versão moderna)                                      #
#                                                                            #
##############################################################################

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║          🎮 BEM-VINDO AO VALE DE AURORA 🎮                   ║"
echo "║                                                                ║"
echo "║     Escolha sua versão para iniciar a aventura:               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "  [1] ⚡ Vanilla JavaScript (imediato, sem instalação)"
echo "  [2] 🚀 React + Vite (moderno, após instalação)"
echo "  [3] 📊 Verificar instalação"
echo "  [4] ❌ Sair"
echo ""

# Obter entrada do usuário
read -p "Escolha uma opção (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Iniciando Vanilla JavaScript..."
    echo ""
    
    # Detectar o sistema operacional
    if command -v python3 &> /dev/null; then
      PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
      PYTHON_CMD="python"
    else
      echo "❌ Python não encontrado. Por favor, instale Python."
      exit 1
    fi
    
    # Usar porta 8000
    PORT=8000
    
    echo "📂 Diretório: $(pwd)"
    echo "🌐 Servidor: http://localhost:$PORT"
    echo "🎮 Game: http://localhost:$PORT/index.html"
    echo ""
    echo "💡 Dica: Abra http://localhost:$PORT/index.html no navegador"
    echo "⚠️  Pressione Ctrl+C para parar o servidor"
    echo ""
    
    # Tentar abrir no navegador automaticamente
    if command -v xdg-open &> /dev/null; then
      xdg-open "http://localhost:$PORT/index.html" 2>/dev/null &
    elif command -v open &> /dev/null; then
      open "http://localhost:$PORT/index.html" 2>/dev/null &
    fi
    
    # Iniciar servidor Python
    $PYTHON_CMD -m http.server $PORT
    ;;
  
  2)
    echo ""
    echo "🚀 Iniciando React + Vite..."
    echo ""
    
    # Verificar se Node.js está instalado
    if ! command -v node &> /dev/null; then
      echo "❌ Node.js não encontrado. Por favor, instale Node.js 16 ou superior."
      echo "   Visite: https://nodejs.org/"
      exit 1
    fi
    
    # Verificar se npm está instalado
    if ! command -v npm &> /dev/null; then
      echo "❌ npm não encontrado. Por favor, instale npm."
      exit 1
    fi
    
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
    echo ""
    
    # Entrar no diretório react-app
    if [ ! -d "react-app" ]; then
      echo "❌ Diretório react-app não encontrado!"
      echo "   Por favor, certifique-se de que você está no diretório correto."
      exit 1
    fi
    
    cd react-app
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
      echo "📦 Instalando dependências..."
      echo "   (Isso pode levar 2-3 minutos na primeira vez)"
      echo ""
      npm install
      
      if [ $? -ne 0 ]; then
        echo "❌ Erro durante a instalação de dependências"
        exit 1
      fi
      
      echo ""
      echo "✅ Dependências instaladas com sucesso!"
    else
      echo "✅ Dependências já instaladas"
    fi
    
    echo ""
    echo "🎮 Iniciando servidor de desenvolvimento..."
    echo "🌐 Acesse: http://localhost:3000"
    echo "⚠️  Pressione Ctrl+C para parar o servidor"
    echo ""
    
    # Iniciar Vite
    npm run dev
    ;;
  
  3)
    echo ""
    echo "🔍 Verificando instalação..."
    echo ""
    
    if [ -f "verify-installation.sh" ]; then
      bash verify-installation.sh
    else
      echo "❌ Script de verificação não encontrado!"
      exit 1
    fi
    ;;
  
  4)
    echo ""
    echo "👋 Até logo! Bom jogo! 🎮"
    echo ""
    exit 0
    ;;
  
  *)
    echo ""
    echo "❌ Opção inválida. Por favor, escolha 1, 2, 3 ou 4."
    echo ""
    exit 1
    ;;
esac

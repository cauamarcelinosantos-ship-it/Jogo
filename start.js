#!/usr/bin/env node

/**
 * 🎮 VALE DE AURORA - INICIALIZADOR COM NODE.JS
 * 
 * Alternativa ao script bash para iniciar o jogo
 * Funciona em Windows, Mac e Linux
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

const isWin = process.platform === 'win32';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                                                                ║');
console.log('║          🎮 BEM-VINDO AO VALE DE AURORA 🎮                   ║');
console.log('║                                                                ║');
console.log('║     Escolha sua versão para iniciar a aventura:               ║');
console.log('║                                                                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('  [1] ⚡ Vanilla JavaScript (imediato, sem instalação)');
console.log('  [2] 🚀 React + Vite (moderno, após instalação)');
console.log('  [3] 📊 Verificar instalação');
console.log('  [4] ❌ Sair\n');

// Simular menu interativo
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Escolha uma opção (1-4): ', (choice) => {
  rl.close();
  
  switch (choice.trim()) {
    case '1':
      runVanillaJS();
      break;
    case '2':
      runReact();
      break;
    case '3':
      runVerification();
      break;
    case '4':
      console.log('\n👋 Até logo! Bom jogo! 🎮\n');
      process.exit(0);
      break;
    default:
      console.log('\n❌ Opção inválida. Por favor, escolha 1, 2, 3 ou 4.\n');
      process.exit(1);
  }
});

function runVanillaJS() {
  console.log('\n🚀 Iniciando Vanilla JavaScript...\n');
  
  const PORT = 8000;
  const http = require('http');
  const url = require('url');
  
  // Criar servidor HTTP simples
  const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Segurança: evitar traversal
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }
    
    // Checar se arquivo existe
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      
      // Determinar content-type
      const ext = path.extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };
      
      const contentType = contentTypes[ext] || 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
  
  server.listen(PORT, () => {
    console.log(`📂 Diretório: ${__dirname}`);
    console.log(`🌐 Servidor: http://localhost:${PORT}`);
    console.log(`🎮 Game: http://localhost:${PORT}/index.html`);
    console.log('\n💡 Dica: Abra http://localhost:' + PORT + '/index.html no navegador');
    console.log('⚠️  Pressione Ctrl+C para parar o servidor\n');
    
    // Tentar abrir navegador
    openBrowser(`http://localhost:${PORT}/index.html`);
  });
}

function runReact() {
  console.log('\n🚀 Iniciando React + Vite...\n');
  
  // Verificar se diretório react-app existe
  const reactDir = path.join(__dirname, 'react-app');
  if (!fs.existsSync(reactDir)) {
    console.log('❌ Diretório react-app não encontrado!');
    console.log('   Por favor, certifique-se de que você está no diretório correto.');
    process.exit(1);
  }
  
  console.log(`✅ Node.js: ${process.version}`);
  console.log(`📂 Diretório: ${reactDir}`);
  console.log('\n');
  
  // Checar se node_modules existe
  const nodeModulesDir = path.join(reactDir, 'node_modules');
  if (!fs.existsSync(nodeModulesDir)) {
    console.log('📦 Instalando dependências...');
    console.log('   (Isso pode levar 2-3 minutos na primeira vez)\n');
    
    const npm = spawn(isWin ? 'npm.cmd' : 'npm', ['install'], {
      cwd: reactDir,
      stdio: 'inherit'
    });
    
    npm.on('close', (code) => {
      if (code !== 0) {
        console.log('\n❌ Erro durante a instalação de dependências');
        process.exit(1);
      }
      startDevServer(reactDir);
    });
  } else {
    console.log('✅ Dependências já instaladas\n');
    startDevServer(reactDir);
  }
}

function startDevServer(dir) {
  console.log('🎮 Iniciando servidor de desenvolvimento...');
  console.log('🌐 Acesse: http://localhost:3000');
  console.log('⚠️  Pressione Ctrl+C para parar o servidor\n');
  
  const dev = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    cwd: dir,
    stdio: 'inherit'
  });
  
  dev.on('close', (code) => {
    process.exit(code);
  });
}

function runVerification() {
  console.log('\n🔍 Verificando instalação...\n');
  
  const verifyScript = path.join(__dirname, 'verify-installation.sh');
  if (!fs.existsSync(verifyScript)) {
    console.log('❌ Script de verificação não encontrado!');
    process.exit(1);
  }
  
  if (isWin) {
    console.log('⚠️  Script bash não compatível com Windows.');
    console.log('   Por favor, use WSL (Windows Subsystem for Linux) ou Git Bash.\n');
    process.exit(1);
  }
  
  const verify = spawn('bash', [verifyScript], {
    stdio: 'inherit'
  });
  
  verify.on('close', (code) => {
    process.exit(code);
  });
}

function openBrowser(url) {
  const start = isWin ? 'start' : 'open';
  const cmd = isWin ? 'start' : (process.platform === 'linux' ? 'xdg-open' : 'open');
  
  try {
    if (isWin) {
      require('child_process').exec(`start ${url}`);
    } else if (process.platform === 'darwin') {
      require('child_process').exec(`open ${url}`);
    } else {
      require('child_process').exec(`xdg-open ${url}`);
    }
  } catch (err) {
    // Navegador não abriu, mas tudo bem
  }
}

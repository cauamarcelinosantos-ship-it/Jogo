#!/usr/bin/env node

/**
 * 🎮 VALE DE AURORA - SERVIDOR SIMPLES
 * 
 * Servidor Node.js para executar o jogo
 * Funciona em Windows, Mac e Linux
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuração
const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';
const ROOT_DIR = __dirname;

// Tipos MIME
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf': 'application/x-font-ttf',
  '.otf': 'application/x-font-opentype',
  '.eot': 'application/vnd.ms-fontobject'
};

// Criar servidor
const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  
  // Remover trailing slash (exceto raiz)
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  
  // Se raiz, servir index.html
  if (pathname === '' || pathname === '/') {
    pathname = '/index.html';
  }
  
  // Caminho completo
  let filePath = path.join(ROOT_DIR, pathname);
  
  // Segurança: prevenir directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }
  
  // Verificar se é diretório
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found\n' + pathname);
      return;
    }
    
    // Se é diretório, tentar servir index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fs.stat(filePath, (err, stats) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        servir(filePath);
      });
    } else {
      servir(filePath);
    }
  });
  
  function servir(filePath) {
    // Ler arquivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
        return;
      }
      
      // Determinar content-type
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      // Headers
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      
      res.end(data);
    });
  }
});

// Iniciar servidor
server.listen(PORT, HOST, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║          🎮 VALE DE AURORA - SERVIDOR INICIADO 🎮   ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log(`📂 Diretório: ${ROOT_DIR}`);
  console.log(`🌐 URL: http://${HOST}:${PORT}`);
  console.log(`🎮 Jogo: http://${HOST}:${PORT}/index.html`);
  console.log(`⚠️  Pressione Ctrl+C para parar\n`);
  
  // Tentar abrir navegador
  openBrowser(`http://${HOST}:${PORT}`);
});

// Erro no servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Porta ${PORT} já está em uso!`);
    console.error(`   Tente com uma porta diferente:`);
    console.error(`   PORT=8001 node server.js\n`);
  } else {
    console.error('❌ Erro no servidor:', err);
  }
  process.exit(1);
});

// Abrir navegador
function openBrowser(url) {
  const isWin = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';
  
  try {
    if (isWin) {
      require('child_process').exec(`start ${url}`);
    } else if (isMac) {
      require('child_process').exec(`open ${url}`);
    } else if (isLinux) {
      require('child_process').exec(`xdg-open ${url}`);
    }
  } catch (err) {
    // Falhar silenciosamente
  }
}

// Limpar ao sair
process.on('SIGINT', () => {
  console.log('\n\n👋 Servidor encerrado. Até logo!\n');
  process.exit(0);
});

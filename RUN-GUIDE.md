# 🚀 GUIAS DE EXECUÇÃO - VALE DE AURORA

Escolha o método que funciona melhor para você:

---

## 🐧 Linux / macOS

### Opção 1: Script Bash (Recomendado) ⭐

```bash
bash start.sh
```

**Vantagens:**
- ✅ Mais rápido
- ✅ Menu interativo bonito
- ✅ Abre navegador automaticamente
- ✅ Detecção automática de porta

**O que faz:**
1. Mostra menu de opções
2. Permite escolher entre Vanilla JS ou React
3. Inicia servidor apropriado
4. Abre no navegador

---

### Opção 2: Node.js

```bash
node start.js
```

**Vantagens:**
- ✅ Funciona em qualquer SO
- ✅ Compatível com Windows também
- ✅ Mesma funcionalidade do bash

**O que faz:**
- Menu interativo em Node.js
- Suporta Vanilla JS e React

---

### Opção 3: Vanilla JS Manual (Sem Script)

```bash
# Linux/macOS com Python:
python3 -m http.server 8000

# Depois abra:
# http://localhost:8000/index.html
```

---

### Opção 4: React Manual

```bash
cd react-app
npm install
npm run dev

# Automaticamente abre: http://localhost:3000
```

---

## 🪟 Windows

### Opção 1: Script Batch ⭐

**Duplo-clique em:**
```
START.bat
```

**OU execute no CMD/PowerShell:**
```cmd
START.bat
```

**O que faz:**
1. Mostra menu de opções (colorido!)
2. Permite escolher entre Vanilla JS ou React
3. Inicia servidor apropriado
4. Detecta Python e Node.js

---

### Opção 2: Node.js

```cmd
node start.js
```

**O que faz:**
- Menu interativo em Node.js
- Compatível com Windows

---

### Opção 3: PowerShell (Vanilla JS)

```powershell
python -m http.server 8000
```

Depois abra no navegador:
```
http://localhost:8000/index.html
```

---

### Opção 4: React Manual

```cmd
cd react-app
npm install
npm run dev
```

Abre automaticamente em `http://localhost:3000`

---

## 🔄 Verificação de Instalação

### Linux / macOS

```bash
bash verify-installation.sh
```

### Windows (com Git Bash)

```bash
bash verify-installation.sh
```

### Windows (com WSL)

```cmd
wsl bash verify-installation.sh
```

---

## 📊 Tabela Comparativa

| Método | SO | Instalação | Facilidade | Recomendado |
|--------|------|-----------|-----------|------------|
| `start.sh` | Linux/macOS | ✅ Nenhuma | ⭐⭐⭐⭐⭐ | ✅ SIM |
| `START.bat` | Windows | ✅ Nenhuma | ⭐⭐⭐⭐⭐ | ✅ SIM |
| `start.js` | Todos | ✅ Node.js | ⭐⭐⭐⭐⭐ | ✅ Alternativa |
| Manual | Todos | Depende | ⭐⭐⭐ | Avançado |

---

## 🎮 Próximas Etapas

### 1️⃣ Após Iniciar

✅ Navegador abre automaticamente  
✅ Jogo carrega em segundos  
✅ Faça login (Google ou Anônimo)  
✅ Explore o Vale de Aurora  

### 2️⃣ Primeiro Jogo

1. Crie novo jogo
2. Explore o mapa 3x3
3. Colete fragmentos
4. Combata inimigos
5. Suba de nível

### 3️⃣ Personalização

Edite os arquivos:
- **Vanilla:** `battle-system.js` (inimigos/skills)
- **React:** `react-app/src/battle-system.js` (mesmo sistema)
- **Estilos:** `battle-styles.css` ou Tailwind

---

## 🆘 Solução de Problemas

### "Porta já em uso"

Mude a porta:
```bash
# Linux/macOS
python3 -m http.server 8080

# Windows (PowerShell)
python -m http.server 8080
```

### "Python não encontrado"

Instale Python: https://python.org  
OU use Node.js: `node start.js`

### "Node.js não encontrado"

Instale Node.js: https://nodejs.org

### "npm ERR! EACCES"

Tente:
```bash
npm install --legacy-peer-deps
```

### "Navegador não abriu"

Abra manualmente:
- Vanilla JS: `http://localhost:8000/index.html`
- React: `http://localhost:3000`

---

## 💾 Versões Disponíveis

### ⚡ Vanilla JavaScript
- **Localização:** `/`
- **Porta:** 8000
- **Instalação:** Nenhuma
- **Inicialização:** Imediata
- **Ideal para:** Aprendizado, testes rápidos

### 🚀 React + Vite + Tailwind
- **Localização:** `/react-app`
- **Porta:** 3000
- **Instalação:** `npm install` (~3 min)
- **Inicialização:** Após instalação
- **Ideal para:** Produção, desenvolvimento, escalabilidade

---

## 📝 Comandos Rápidos

```bash
# Vanilla JS imediato
bash start.sh

# React com setup automático
bash start.sh

# Verificar tudo está OK
bash verify-installation.sh

# Parar servidor
Ctrl + C

# React manual
cd react-app && npm install && npm run dev

# Atualizar dependências React
cd react-app && npm update

# Limpar cache npm (se houver problemas)
cd react-app && rm -rf node_modules package-lock.json && npm install
```

---

## ✅ Checklist para Começar

- [ ] Escolha seu SO (Windows/Mac/Linux)
- [ ] Abra terminal/cmd no diretório do projeto
- [ ] Execute o script apropriado
- [ ] Aguarde abertura do navegador
- [ ] Faça login no jogo
- [ ] Crie novo jogo
- [ ] Divirta-se! 🎮

---

## 🎯 Recomendações

**Para começar AGORA:**
```bash
bash start.sh
# Escolha opção 1 (Vanilla JS)
# Jogue em segundos!
```

**Para desenvolvimento:**
```bash
bash start.sh
# Escolha opção 2 (React)
# Instale (2-3 min) e desenvolva!
```

**Para verificar tudo:**
```bash
bash start.sh
# Escolha opção 3 (Verificar)
# Confirme que tudo está OK
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique a instalação: `bash start.sh` → opção 3
2. Leia `QUICK-START.txt` para guia visual
3. Consulte `README.md` para documentação completa
4. Veja `USAGE-EXAMPLES.js` para exemplos de código

---

**Bom jogo! 🗡️⚔️🛡️**

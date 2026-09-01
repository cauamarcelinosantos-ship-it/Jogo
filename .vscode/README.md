# ⚙️ Configurações VS Code para Vale de Aurora

Este diretório contém as configurações do VS Code para facilitar o desenvolvimento e execução do Jogo Vale de Aurora.

## 📋 Arquivos de Configuração

### `launch.json` - Configurações de Execução
Define as opções de "Debug" (F5) disponíveis:

- **🎮 Vale de Aurora - Porta 8000** (Recomendado)
- **🎮 Vale de Aurora - Porta 3000**
- **🎮 Vale de Aurora - Porta 5000**
- **⚛️ React + Vite - Porta 3000**
- **Launch Chrome** - Debug no Chrome

### `tasks.json` - Tarefas
Define tarefas executáveis via `Ctrl+Shift+P` → `Tasks: Run Task`:

- **🎮 Servidor - Porta 8000**
- **🎮 Servidor - Porta 3000**
- **⚛️ React - Instalar e Executar**
- **✅ Verificar Instalação**
- **🚀 Menu de Execução**

### `extensions.json` - Extensões Recomendadas
Lista as extensões VS Code recomendadas para o projeto:

- Node Debugger
- Chrome Debugger
- ESLint
- Prettier
- Live Server
- Git Lens
- GitHub Copilot

### `settings.json` - Configurações do Editor
Define comportamento do editor:

- Formatação automática ao salvar
- Auto-save em 1 segundo
- Prettier como formatador padrão
- Exclusões de pasta
- Configurações de terminal

## 🚀 Como Usar

### Opção 1: Pressionar F5 (Mais Fácil)
```
1. Qualquer lugar do arquivo
2. Pressione: F5
3. Escolha a configuração
4. Servidor inicia e navegador abre
```

### Opção 2: Menu de Debug
```
1. Clique em "Run and Debug" (esquerda)
2. Escolha a configuração no dropdown
3. Clique no botão Play (verde)
```

### Opção 3: Command Palette
```
Ctrl+Shift+P → "Debug: Start Debugging"
Escolha a configuração
```

### Opção 4: Tasks
```
Ctrl+Shift+P → "Tasks: Run Task"
Escolha a tarefa desejada
```

## ⚡ Atalhos Úteis

| Atalho | Ação |
|--------|------|
| F5 | Inicia debug |
| Shift+F5 | Para debug |
| Ctrl+Shift+D | Abre aba Debug |
| Ctrl+Shift+P | Command Palette |
| Ctrl+` | Terminal integrado |
| Ctrl+Shift+X | Extensões |

## 🎯 Fluxo Típico

1. **Abra o projeto** no VS Code
2. **Pressione F5**
3. **Escolha** "🎮 Vale de Aurora - Porta 8000"
4. **Aguarde** inicialização (3 seg)
5. **Navegador abre** automaticamente
6. **Faça login** e **jogue!**
7. **Pressione Ctrl+C** para parar

## 🔧 Configurações Importantes

### Porta Padrão
- **Vanilla JS**: 8000
- **React**: 3000

### Variáveis de Ambiente
- `PORT`: Porta de execução
- `NODE_ENV`: development/production

### Formatação
- **Formatter**: Prettier
- **Save Format**: Automático
- **Auto Save**: 1 segundo

## 📝 Próximos Passos

1. ✅ Instale as extensões recomendadas
2. ✅ Pressione F5 e escolha uma configuração
3. ✅ Jogue Vale de Aurora!

---

**Bom desenvolvimento! 🎮**

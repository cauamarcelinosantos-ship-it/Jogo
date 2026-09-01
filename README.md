# Jogo - Vale de Aurora

🎮 Jogo de exploração e combate por turnos com duas versões: **Vanilla JavaScript** e **React**.

## 📦 Estrutura do Projeto

```
Jogo/
├── 📄 index.html              # Versão vanilla JS - HTML principal
├── 📄 app.js                  # Versão vanilla JS - Lógica do jogo
├── 📄 app-firebase.js         # Integração Firebase
├── 📄 style.css               # Estilos vanilla JS
├── 📄 battle-system.js        # ⚔️ Sistema de combate (vanilla JS)
├── 📄 battle-styles.css       # Estilos do combate (vanilla JS)
├── 📄 firebase-config.js      # Configuração Firebase
├── 📁 react-app/              # 🚀 Versão React (Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── battle-system.js   # ⚔️ Sistema de combate (React)
│   │   └── index.css          # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── 📄 README.md               # Este arquivo
```

## 🎯 Versão 1: Vanilla JavaScript (HTML Puro)

### Como executar

1. **Abra o arquivo** `index.html` em um navegador
2. **Ou sirva localmente**:
   ```bash
   # Com Python 3
   python -m http.server 8000
   
   # Com Node.js (http-server)
   npx http-server
   ```
3. Abra `http://localhost:8000` no navegador

### 🎮 Como Jogar

1. **Login**: Entre com sua conta Google ou anonimamente
2. **Explore o Mapa**: Use as setas ou botões para mover-se
3. **Colete Fragmentos**: Encontre os 3 fragmentos de Aurora
4. **Chegue ao Portal**: Com todos os fragmentos, acesse o portal para completar o nível
5. **Combata Inimigos**: Encontre inimigos e use habilidades estratégicas para vencer
6. **Suba de Nível**: Ganhe XP derrotando inimigos

### 🛡️ Sistema de Combate (Vanilla JS)

- **4 Habilidades**:
  - ⚔️ Ataque (0 MP) - Dano básico
  - 🔥 Bola de Fogo (20 MP) - Dano alto
  - 💚 Cura (15 MP) - Recupera HP
  - 🛡️ Defesa (10 MP) - Reduz dano recebido

- **Inimigos Variados**:
  - 👹 Goblin (fácil)
  - 💀 Esqueleto (normal)
  - 🧙 Bruxa (chefe)
  - 🐉 Dragão (chefe final)

## 🚀 Versão 2: React (Moderna)

### Como executar

```bash
cd react-app

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse `http://localhost:3000` no navegador

### 🎮 Como Jogar

Mesma mecânica da versão vanilla, mas com:
- ✨ Interface moderna e responsiva
- 🎨 Estilos com Tailwind CSS
- ⚡ Performance otimizada com React
- 📱 Totalmente mobile-friendly

### ⚙️ Stack Tecnológico

- **React 18**: Framework UI moderno
- **Vite**: Build tool ultrarrápido
- **Tailwind CSS**: Styling utilitário
- **Firebase**: Backend (opcional)

## 📊 Recursos Compartilhados

Ambas as versões compartilham:
- ✅ Sistema de combate idêntico
- ✅ Base de dados de inimigos
- ✅ Sistema de habilidades
- ✅ Lógica de XP e progressão

## 🎮 Mecânicas do Jogo

### Exploração
- Mapa 3x3 do Vale de Aurora
- Múltiplos tipos de células: fragmentos, água, floresta, portal
- Power-ups defensivos

### Combate por Turnos
- Sistema de HP/MP
- 4 habilidades por herói
- IA básica para inimigos
- Log de batalha em tempo real

### Progressão
- Sistema de XP
- Múltiplos níveis (1-3 na versão vanilla, ilimitado na React)
- Aumento de dificuldade progressivo
- Inimigos únicos para cada nível

## 💾 Armazenamento

### Vanilla JS
- **localStorage**: Progresso do jogo por usuário
- **IndexedDB**: Dados de usuário/sessão

### React
- **Estado em memória**: Dados durante a sessão
- **Preparado para Firebase**: Fácil integração

## 📱 Responsividade

Ambas as versões são totalmente responsivas:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🛠️ Desenvolvimento

### Adicionar novo inimigo

```javascript
// Em battle-system.js ou react-app/src/battle-system.js
ENEMIES_DATABASE.push({
  id: 'meu-inimigo',
  name: 'Meu Inimigo',
  maxHp: 50,
  sprite: '🧟',
  isBoss: false,
  attack: { min: 5, max: 15 },
  xpReward: 100
});
```

### Adicionar nova habilidade

```javascript
SKILLS_CONFIG.minha_habilidade = {
  id: 'minha-habilidade',
  name: 'Minha Habilidade',
  cost: 25,
  damage: { min: 20, max: 40 },
  description: 'Descrição da habilidade'
};
```

## 📝 Notas

- Vanilla JS: Todos os estilos em CSS puro, sem dependências
- React: Usa Tailwind CSS para estilos, muito mais moderno
- Ambas compartilham a lógica de combate (`battle-system.js`)

## 🤝 Contribuições

Sinta-se livre para adicionar:
- Novos inimigos
- Novas habilidades
- Novos tipos de células no mapa
- Melhorias visuais
- Otimizações de performance

## 📜 Licença

MIT - Sinta-se livre para usar como desejar!

---

**Versão 1 (Vanilla)**: 100% vanilla JavaScript, sem dependências
**Versão 2 (React)**: Moderna, responsiva, preparada para escalar

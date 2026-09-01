# Jogo - Versão React (Vale de Aurora)

Versão moderna do jogo Jogo com React, Vite e Tailwind CSS.

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn

## 🚀 Instalação e Uso

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎮 Como Jogar

1. **Exploração**: Navigate pelo mapa do Vale de Aurora
2. **Combates**: Encontre inimigos e vença-os usando habilidades estratégicas
3. **Progressão**: Ganhe XP, suba de nível e colecione fragmentos mágicos
4. **Objetivo**: Chegue ao portal com todos os fragmentos coletados

## 🎯 Recursos

- ⚔️ Sistema de combate por turnos
- 🛡️ 4 habilidades principais (Ataque, Bola de Fogo, Cura, Defesa)
- 👹 Inimigos variados com diferentes dificuldades
- 📊 Sistema de XP e progressão de nível
- 🎨 Interface responsiva com Tailwind CSS

## 📁 Estrutura do Projeto

```
react-app/
├── src/
│   ├── components/
│   │   ├── BattleComponents.jsx    # Componentes de batalha
│   │   └── Game.jsx                # Componente principal
│   ├── battle-system.js            # Lógica de combate
│   ├── index.css                   # Estilos globais
│   └── main.jsx                    # Entry point
├── index.html                      # HTML principal
├── vite.config.js                  # Configuração Vite
├── tailwind.config.js              # Configuração Tailwind
└── package.json                    # Dependências
```

## 🎨 Tecnologias

- **React 18**: Framework UI
- **Vite**: Build tool rápido
- **Tailwind CSS**: Styling utilitário
- **Firebase**: Backend (opcional)

## 📝 Notas

- Todos os dados são armazenados em memória durante a sessão
- O sistema de battle é compartilhado com a versão vanilla JS
- Totalmente responsivo para mobile, tablet e desktop

## 🔗 Versão Vanilla JS

Veja a pasta raiz do projeto para a versão vanilla JavaScript do jogo.

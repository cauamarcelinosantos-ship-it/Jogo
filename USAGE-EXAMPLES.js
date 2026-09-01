#!/usr/bin/env node

/**
 * 📖 EXEMPLOS DE USO - Jogo Vale de Aurora
 * 
 * Este arquivo contém exemplos práticos de como usar o sistema de combate
 * em ambas as versões (Vanilla JS e React)
 */

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 1: VANILLA JS - Usando o BattleManager
// ═══════════════════════════════════════════════════════════════════════════

/*
// No seu app.js (após carregar battle-system.js)

// 1. Criar um herói
const meuHeroi = {
  name: 'Aventureiro',
  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 50,
  maxMp: 50,
  sprite: '⚔️',
  xp: 0,
  xpToNext: 100
};

// 2. Criar o gerenciador de batalha
const battleManager = new BattleManager(meuHeroi);
const battleRenderer = new BattleScreenRenderer('battle-container');
battleRenderer.setBattleManager(battleManager);

// 3. Iniciar uma batalha
const battle = battleManager.startBattle('goblin');
console.log(battle); // Mostra o estado da batalha

// 4. Usar uma habilidade
const sucesso = battleManager.useSkill('fireball');
if (sucesso) {
  battleRenderer.renderBattle(battle); // Renderiza UI
  
  // 5. Turno do inimigo após 1 segundo
  setTimeout(() => {
    battleManager.executeEnemyTurn();
    
    // Se a batalha terminou
    if (battle.battleEnded) {
      battleRenderer.renderResult(
        battle,
        () => console.log('Continuar'),
        () => console.log('Reiniciar')
      );
    }
  }, 1000);
}

// 6. Alternativamente, fugir
const conseguiuFugir = battleManager.flee();
console.log(conseguiuFugir); // true ou false

// 7. Acessar o log da batalha
console.log(battle.getLog()); // Array com eventos
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 2: REACT - Usando BattleManager em Componentes
// ═══════════════════════════════════════════════════════════════════════════

/*
// Em seu componente Game.jsx (veja react-app/src/components/Game.jsx)

import React, { useState, useCallback } from 'react';
import { BattleManager } from '../battle-system';
import { BattleScreen, ResultScreen } from './BattleComponents';

export function Game() {
  const [hero, setHero] = useState({
    name: 'Herói',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    xp: 0,
    xpToNext: 100
  });

  const [battleManager] = useState(() => new BattleManager(hero));
  const [battle, setBattle] = useState(null);

  // Iniciar batalha
  const startBattle = useCallback(() => {
    const newBattle = battleManager.startBattle('skeleton');
    setBattle(newBattle);
  }, [battleManager]);

  // Usar habilidade
  const handleSkill = useCallback((skillId) => {
    if (!battle) return;

    battleManager.useSkill(skillId);
    setBattle({ ...battleManager.currentBattle });

    // Turno do inimigo
    setTimeout(() => {
      battleManager.executeEnemyTurn();
      setBattle({ ...battleManager.currentBattle });
    }, 1000);
  }, [battle, battleManager]);

  if (!battle) {
    return <button onClick={startBattle}>Iniciar Batalha</button>;
  }

  return (
    <BattleScreen
      battle={battle}
      skills={battleManager.getSkills()}
      onSkill={handleSkill}
      onFlee={() => handleFlee()}
    />
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 3: Adicionar Novo Inimigo
// ═══════════════════════════════════════════════════════════════════════════

/*
// Em battle-system.js ou react-app/src/battle-system.js

// Adicionar um novo inimigo ao banco de dados
ENEMIES_DATABASE.push({
  id: 'orc',
  name: 'Orc Guerreiro',
  maxHp: 75,
  hp: 75,
  mp: 25,
  sprite: '🗡️',
  isBoss: false,
  attack: { min: 8, max: 18 },
  xpReward: 120
});

// Agora você pode iniciar batalha com:
battleManager.startBattle('orc');
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 4: Adicionar Nova Habilidade
// ═══════════════════════════════════════════════════════════════════════════

/*
// Em battle-system.js ou react-app/src/battle-system.js

SKILLS_CONFIG.relampago = {
  id: 'relampago',
  name: 'Relâmpago',
  cost: 30,
  damage: { min: 25, max: 45 },
  description: 'Ataque elétrico devastador'
};

// Agora está disponível para usar:
battleManager.useSkill('relampago');
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 5: Debugar uma Batalha
// ═══════════════════════════════════════════════════════════════════════════

/*
// No console do navegador (F12)

// Ver estado completo da batalha
console.log(battleManager.currentBattle);

// Ver herói
console.log(battleManager.hero);

// Ver inimigo
console.log(battleManager.currentBattle.enemy);

// Ver log de ações
console.log(battleManager.currentBattle.getLog());

// Ver se é turno do jogador
console.log(battleManager.currentBattle.isPlayerTurn);

// Ver MP disponível
console.log(battleManager.currentBattle.hero.mp);

// Ver habilidades disponíveis
console.log(battleManager.getSkills());

// Ver XP ganho
console.log(battleManager.currentBattle.enemy.xpReward);
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 6: Fluxo Completo de Batalha
// ═══════════════════════════════════════════════════════════════════════════

/*
// 1️⃣ Inicializar
const heroi = { name: 'Guerreiro', maxHp: 100, hp: 100, maxMp: 50, mp: 50, level: 1, xp: 0, xpToNext: 100 };
const manager = new BattleManager(heroi);
const renderer = new BattleScreenRenderer('container');
renderer.setBattleManager(manager);

// 2️⃣ Começar
const battle = manager.startBattle('dragon');
renderer.renderBattle(battle);

// 3️⃣ Turno do jogador
manager.useSkill('fireball');
console.log(battle.getLog()); // ["Guerreiro usou Bola de Fogo! Dano: 22"]

// 4️⃣ Renderizar estado atualizado
renderer.renderBattle(battle);

// 5️⃣ Se não terminou, turno do inimigo
if (!battle.battleEnded) {
  setTimeout(() => {
    manager.executeEnemyTurn();
    renderer.renderBattle(battle);
    
    // 6️⃣ Verificar resultado
    if (battle.battleEnded) {
      if (battle.result === 'victory') {
        console.log('Você venceu!');
        renderer.renderResult(battle, () => {}, () => {});
      } else if (battle.result === 'defeat') {
        console.log('Você foi derrotado!');
        renderer.renderResult(battle, () => {}, () => {});
      }
    }
  }, 1000);
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 7: Listar Todos os Inimigos e Habilidades
// ═══════════════════════════════════════════════════════════════════════════

/*
// Listar inimigos
console.log('=== INIMIGOS ===');
ENEMIES_DATABASE.forEach(enemy => {
  console.log(`${enemy.sprite} ${enemy.name}: ${enemy.maxHp} HP, ${enemy.xpReward} XP`);
});

// Listar habilidades
console.log('=== HABILIDADES ===');
Object.values(SKILLS_CONFIG).forEach(skill => {
  console.log(`${skill.name} (${skill.cost} MP): ${skill.description}`);
});
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 8: Simular Múltiplas Batalhas
// ═══════════════════════════════════════════════════════════════════════════

/*
// Simular 3 batalhas em sequência
async function simularBatalhas() {
  const heroi = {
    name: 'Herói',
    maxHp: 100,
    hp: 100,
    maxMp: 50,
    mp: 50,
    level: 1,
    xp: 0,
    xpToNext: 100
  };

  const manager = new BattleManager(heroi);

  for (let i = 0; i < 3; i++) {
    console.log(`\n=== BATALHA ${i + 1} ===`);
    
    const battle = manager.startBattle('goblin');
    
    // Simular turnos
    while (!battle.battleEnded) {
      manager.useSkill('attack');
      if (!battle.battleEnded) {
        manager.executeEnemyTurn();
      }
    }
    
    console.log(`Resultado: ${battle.result}`);
    console.log(`Log: ${battle.getLog().join(' | ')}`);
    
    // Aguardar antes da próxima batalha
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\nHerói final: Level ${heroi.level}, XP ${heroi.xp}`);
}

// simularBatalhas();
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 9: Criar um Inimigo Boss Custom
// ═══════════════════════════════════════════════════════════════════════════

/*
const bossFinal = {
  id: 'rei-fantasma',
  name: 'Rei Fantasma',
  maxHp: 200,
  hp: 200,
  mp: 100,
  sprite: '👻',
  isBoss: true,
  attack: { min: 20, max: 40 },
  xpReward: 1000
};

ENEMIES_DATABASE.push(bossFinal);

// Iniciar batalha contra o boss
const battle = battleManager.startBattle('rei-fantasma');
console.log(`Enfrentando: ${battle.enemy.name} (${battle.enemy.maxHp} HP)`);
*/

// ═══════════════════════════════════════════════════════════════════════════
// EXEMPLO 10: Acompanhar XP e Level-ups
// ═══════════════════════════════════════════════════════════════════════════

/*
const heroi = {
  name: 'Guerreiro',
  maxHp: 100,
  hp: 100,
  maxMp: 50,
  mp: 50,
  level: 1,
  xp: 0,
  xpToNext: 100
};

const manager = new BattleManager(heroi);

function verificarProgresso() {
  console.log(`Level: ${heroi.level}`);
  console.log(`XP: ${heroi.xp}/${heroi.xpToNext}`);
  console.log(`Progresso: ${(heroi.xp / heroi.xpToNext * 100).toFixed(1)}%`);
}

// Batalha 1
manager.startBattle('goblin');
manager.useSkill('attack');
console.log('\n=== APÓS BATALHA 1 ===');
verificarProgresso();

// Batalha 2
manager.hero = heroi; // Sincronizar
manager.startBattle('goblin');
manager.useSkill('attack');
console.log('\n=== APÓS BATALHA 2 ===');
verificarProgresso();
*/

// ═══════════════════════════════════════════════════════════════════════════
// NOTAS
// ═══════════════════════════════════════════════════════════════════════════

/*
📝 PONTOS IMPORTANTES:

1. BattleManager é um gerenciador de estado, não renderiza nada
   → Use BattleScreenRenderer (Vanilla) ou Componentes React para renderizar

2. Todos os dados são em memória (não persistem automaticamente)
   → Salve com localStorage/Firebase conforme necessário

3. Os inimigos são clonados quando cria uma batalha
   → Modificações não afetam o banco de dados original

4. XP e level-ups são aplicados ao herói original
   → Sincronize os estados após batalhas (React)

5. O log da batalha fica no objeto battle
   → Acesse com battle.getLog()

6. Habilidades custam MP do herói
   → Implementar sistema de recarga conforme necessário

7. A IA do inimigo é básica (turnos aleatórios)
   → Customize em executeEnemyTurn() para IA mais inteligente

8. Defesa reduz dano em 50% apenas no próximo ataque
   → Isso é por design, customize conforme necessar

🎮 DICA: Estude o código em battle-system.js para entender como funciona!
*/

console.log('✅ Exemplos de uso carregados com sucesso!');
console.log('📖 Descomente as seções acima para testá-las');

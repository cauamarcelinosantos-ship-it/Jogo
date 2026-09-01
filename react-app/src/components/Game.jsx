import React, { useState, useCallback } from 'react';
import { BattleScreen, ResultScreen } from './BattleComponents';
import { BattleManager, ENEMIES_DATABASE } from '../battle-system';

export function Game() {
  // Estado do herói
  const [hero, setHero] = useState({
    name: 'Herói',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    sprite: '⚔️',
    xp: 0,
    xpToNext: 100
  });

  // Estado da batalha
  const [battleManager] = useState(() => new BattleManager(hero));
  const [battle, setBattle] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [gameScreen, setGameScreen] = useState('map'); // 'map', 'battle', 'result'

  // Iniciar uma nova batalha
  const startBattle = useCallback(() => {
    const randomEnemy = ENEMIES_DATABASE[Math.floor(Math.random() * ENEMIES_DATABASE.length)];
    battleManager.hero = hero;
    
    const newBattle = battleManager.startBattle(randomEnemy.id);
    setBattle(newBattle);
    setGameScreen('battle');
  }, [hero, battleManager]);

  // Usar habilidade na batalha
  const handleSkill = useCallback((skillId) => {
    if (!battle) return;

    const success = battleManager.useSkill(skillId);
    if (success && battle.battleEnded) {
      setBattle({ ...battleManager.currentBattle });
      setBattleResult(battleManager.currentBattle.result);
      setGameScreen('result');
    } else if (success) {
      setBattle({ ...battleManager.currentBattle });
      
      // Enemy turn após um delay
      setTimeout(() => {
        battleManager.executeEnemyTurn();
        
        if (battleManager.currentBattle.battleEnded) {
          setBattle({ ...battleManager.currentBattle });
          setBattleResult(battleManager.currentBattle.result);
          setGameScreen('result');
        } else {
          setBattle({ ...battleManager.currentBattle });
        }
      }, 1000);
    }
  }, [battle, battleManager]);

  // Fugir da batalha
  const handleFlee = useCallback(() => {
    if (!battle) return;

    const success = battleManager.flee();
    setBattle({ ...battleManager.currentBattle });
    
    if (success) {
      setBattleResult('flee');
      setGameScreen('result');
    } else {
      // Enemy turn após falha em fugir
      setTimeout(() => {
        battleManager.executeEnemyTurn();
        
        if (battleManager.currentBattle.battleEnded) {
          setBattle({ ...battleManager.currentBattle });
          setBattleResult(battleManager.currentBattle.result);
          setGameScreen('result');
        } else {
          setBattle({ ...battleManager.currentBattle });
        }
      }, 1000);
    }
  }, [battle, battleManager]);

  // Continuar após vitória/level up
  const handleContinue = useCallback(() => {
    setHero(battleManager.hero);
    setBattle(null);
    setBattleResult(null);
    setGameScreen('map');
  }, [battleManager]);

  // Tentar de novo após derrota
  const handleRestart = useCallback(() => {
    setHero({
      name: 'Herói',
      level: 1,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      sprite: '⚔️',
      xp: 0,
      xpToNext: 100
    });
    setBattle(null);
    setBattleResult(null);
    setGameScreen('map');
  }, []);

  if (gameScreen === 'battle' && battle) {
    return (
      <div className="min-h-screen bg-muted p-4 md:p-8">
        <BattleScreen 
          battle={battle}
          skills={battleManager.getSkills()}
          onSkill={handleSkill}
          onFlee={handleFlee}
        />
      </div>
    );
  }

  if (gameScreen === 'result' && battle) {
    const resultMessages = {
      victory: `Você venceu ${battle.enemy.name}! Ganhou ${battle.enemy.xpReward} XP.`,
      levelUp: `Parabéns! Você alcançou o nível ${battle.hero.level}!`,
      defeat: `Você foi derrotado por ${battle.enemy.name}...`,
      flee: 'Você conseguiu fugir da batalha!'
    };

    return (
      <div className="min-h-screen bg-muted p-4 md:p-8 flex items-center justify-center">
        <ResultScreen 
          message={resultMessages[battleResult] || 'Fim da batalha'}
          type={battleResult}
          onContinue={handleContinue}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Tela do mapa
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-muted to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-card p-6 rounded-lg border border-secondary shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{hero.sprite}</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{hero.name}</h1>
                <p className="text-sm text-muted-foreground">Nível {hero.level}</p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">HP</p>
                <p className="text-lg font-bold text-foreground">{hero.hp}/{hero.maxHp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">MP</p>
                <p className="text-lg font-bold text-foreground">{hero.mp}/{hero.maxMp}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">XP</p>
                <p className="text-lg font-bold text-foreground">{hero.xp}/{hero.xpToNext}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card p-8 rounded-lg border border-secondary shadow-sm text-center space-y-8">
          <div>
            <p className="text-muted-foreground uppercase text-sm mb-2">Vale de Aurora</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Encontre os fragmentos</h2>
            <p className="text-muted-foreground mb-6">
              Explore o misterioso Vale de Aurora, enfrente inimigos poderosos e colecionando fragmentos mágicos.
            </p>
          </div>

          {/* Map */}
          <div className="bg-gradient-to-br from-muted/50 to-primary/5 p-8 rounded-lg border border-secondary">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg border border-secondary flex items-center justify-center text-4xl hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => i === 4 && startBattle()}
                >
                  {i === 4 ? hero.sprite : ['✦', '🌲', '✦', '⌁', '●', '⭐', '✦', '🌲', '◉'][i]}
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center flex-wrap mb-4">
              <span className="text-sm"><span className="text-xl">●</span> Você</span>
              <span className="text-sm"><span className="text-xl">✦</span> Fragmento</span>
              <span className="text-sm"><span className="text-xl">◉</span> Portal</span>
              <span className="text-sm"><span className="text-xl">👾</span> Inimigo</span>
              <span className="text-sm"><span className="text-xl">⭐</span> Escudo</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={startBattle}
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Iniciar Aventura
          </button>

          {/* Debug Info */}
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded border border-secondary">
            <p>Clique na posição central do mapa ou no botão acima para começar uma batalha</p>
          </div>
        </div>
      </div>
    </div>
  );
}

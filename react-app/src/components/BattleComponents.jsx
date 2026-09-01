import React from 'react';
import { SKILLS_CONFIG } from './battle-system';

export function StatBar({ label, current, max, colorClass = 'bg-red-600' }) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex justify-between">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-muted-foreground text-xs">{current}/{max}</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden border border-secondary/50">
        <div 
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export function BattleScreen({ battle, skills, onSkill, onFlee }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-4 items-center p-6 bg-gradient-to-br from-muted/50 to-primary/5 rounded-lg border border-secondary">
        {/* HERO */}
        <div className="flex flex-col items-end gap-3 text-right">
          <span className="text-6xl font-bold">{battle.hero.sprite}</span>
          <div className="w-full">
            <h3 className="text-lg font-bold text-foreground">{battle.hero.name}</h3>
            <p className="text-sm text-muted-foreground">Nv {battle.hero.level}</p>
          </div>
          <div className="w-full">
            <StatBar 
              label="HP" 
              current={battle.hero.hp} 
              max={battle.hero.maxHp}
              colorClass="bg-red-600"
            />
          </div>
          <div className="w-full">
            <StatBar 
              label="MP" 
              current={battle.hero.mp} 
              max={battle.hero.maxMp}
              colorClass="bg-blue-600"
            />
          </div>
        </div>

        {/* VS */}
        <div className="text-3xl font-bold text-primary text-center">⚔️</div>

        {/* ENEMY */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-6xl font-bold">{battle.enemy.sprite}</span>
          <div className="w-full">
            <h3 className="text-lg font-bold text-foreground">{battle.enemy.name}</h3>
            <p className="text-sm text-muted-foreground">
              {battle.enemy.isBoss ? "CHEFE" : "Inimigo"}
            </p>
          </div>
          <div className="w-48">
            <StatBar 
              label="HP" 
              current={battle.enemy.hp} 
              max={battle.enemy.maxHp}
              colorClass="bg-red-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {skills.map((skill) => (
          <button
            key={skill.id}
            onClick={() => onSkill(skill.id)}
            disabled={skill.cost > battle.hero.mp}
            className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <div>{skill.name}</div>
            <div className="text-xs opacity-70">
              {skill.cost > 0 ? `${skill.cost} MP` : "Livre"}
            </div>
          </button>
        ))}
        <button
          onClick={onFlee}
          className="px-3 py-2 rounded-lg border border-secondary bg-muted text-foreground font-medium hover:bg-secondary/20 transition-colors text-sm"
        >
          Fugir
        </button>
      </div>

      <div className="w-full rounded-lg bg-muted p-3 h-40 overflow-y-auto border border-secondary">
        {battle.log.length === 0 && (
          <p className="text-sm text-muted-foreground italic">A batalha começou...</p>
        )}
        {battle.log.map((entry, idx) => (
          <p key={idx} className="text-sm text-foreground py-0.5">
            • {entry}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ResultScreen({ message, type, onContinue, onRestart }) {
  const isDefeat = type === "defeat";
  const isLevelUp = type === "levelUp";
  
  const emojiMap = {
    defeat: '☠️',
    levelUp: '✦',
    victory: '✓'
  };
  
  const titleMap = {
    defeat: 'Derrota',
    levelUp: 'Nível Aumentado!',
    victory: 'Vitória'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-6">
      <div className="text-6xl">
        {emojiMap[type] || '?'}
      </div>
      <h2 className="text-3xl font-bold text-foreground">
        {titleMap[type] || 'Resultado'}
      </h2>
      <p className="text-lg text-muted-foreground max-w-md">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {!isDefeat ? (
          <button
            onClick={onContinue}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Continuar
          </button>
        ) : (
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Tentar de Novo
          </button>
        )}
      </div>
    </div>
  );
}

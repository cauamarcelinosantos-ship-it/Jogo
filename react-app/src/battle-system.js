// Configuração de habilidades
export const SKILLS_CONFIG = {
  attack: {
    id: 'attack',
    name: 'Ataque',
    cost: 0,
    damage: { min: 5, max: 15 },
    description: 'Ataque básico'
  },
  fireball: {
    id: 'fireball',
    name: 'Bola de Fogo',
    cost: 20,
    damage: { min: 15, max: 30 },
    description: 'Fogo intenso'
  },
  heal: {
    id: 'heal',
    name: 'Cura',
    cost: 15,
    heal: { min: 20, max: 40 },
    description: 'Recupera HP'
  },
  defend: {
    id: 'defend',
    name: 'Defesa',
    cost: 10,
    defense: 0.5,
    description: 'Reduz dano'
  }
};

// Inimigos disponíveis
export const ENEMIES_DATABASE = [
  {
    id: 'goblin',
    name: 'Goblin',
    maxHp: 30,
    hp: 30,
    mp: 20,
    sprite: '👹',
    isBoss: false,
    attack: { min: 2, max: 8 },
    xpReward: 50
  },
  {
    id: 'skeleton',
    name: 'Esqueleto',
    maxHp: 40,
    hp: 40,
    mp: 15,
    sprite: '💀',
    isBoss: false,
    attack: { min: 4, max: 10 },
    xpReward: 75
  },
  {
    id: 'dragon',
    name: 'Dragão',
    maxHp: 100,
    hp: 100,
    mp: 50,
    sprite: '🐉',
    isBoss: true,
    attack: { min: 15, max: 30 },
    xpReward: 500
  },
  {
    id: 'witch',
    name: 'Bruxa',
    maxHp: 50,
    hp: 50,
    mp: 60,
    sprite: '🧙',
    isBoss: true,
    attack: { min: 10, max: 25 },
    xpReward: 300
  }
];

// Classe BattleState
export class BattleState {
  constructor(hero, enemy) {
    this.hero = { ...hero };
    this.enemy = { ...enemy };
    this.log = [];
    this.turn = 0;
    this.isPlayerTurn = true;
    this.battleEnded = false;
    this.result = null;
    this.defendActive = false;
  }

  addLog(message) {
    this.log.push(message);
  }

  getLog() {
    return [...this.log];
  }
}

// Classe BattleManager
export class BattleManager {
  constructor(hero) {
    this.hero = hero;
    this.currentBattle = null;
  }

  startBattle(enemyId) {
    const enemy = ENEMIES_DATABASE.find(e => e.id === enemyId);
    if (!enemy) {
      console.error(`Inimigo ${enemyId} não encontrado`);
      return null;
    }

    this.currentBattle = new BattleState(this.hero, { ...enemy });
    this.currentBattle.addLog(`${this.hero.name} encontrou um ${enemy.name}!`);
    return this.currentBattle;
  }

  useSkill(skillId) {
    if (!this.currentBattle || !this.currentBattle.isPlayerTurn) {
      return false;
    }

    const skill = SKILLS_CONFIG[skillId];
    if (!skill) {
      this.currentBattle.addLog('Habilidade inválida!');
      return false;
    }

    if (skill.cost > this.currentBattle.hero.mp) {
      this.currentBattle.addLog(`MP insuficiente! (Precisa: ${skill.cost}, Tem: ${this.currentBattle.hero.mp})`);
      return false;
    }

    this.currentBattle.hero.mp -= skill.cost;

    if (skill.damage) {
      this._executeAttack(skill);
    } else if (skill.heal) {
      this._executeHeal(skill);
    } else if (skill.defense !== undefined) {
      this._executeDefense(skill);
    }

    if (this.currentBattle.enemy.hp <= 0) {
      this._endBattle('victory');
      return true;
    }

    this.currentBattle.isPlayerTurn = false;
    return true;
  }

  executeEnemyTurn() {
    if (!this.currentBattle || this.currentBattle.battleEnded) return;

    const skills = Object.values(SKILLS_CONFIG);
    const availableSkills = skills.filter(s => s.cost <= this.currentBattle.enemy.mp);
    
    const skill = availableSkills.length > 0 
      ? availableSkills[Math.floor(Math.random() * availableSkills.length)]
      : SKILLS_CONFIG.attack;

    if (skill.damage) {
      const damage = Math.floor(Math.random() * (skill.damage.max - skill.damage.min + 1)) + skill.damage.min;
      const actualDamage = this.currentBattle.defendActive ? Math.floor(damage * 0.5) : damage;
      
      this.currentBattle.hero.hp -= actualDamage;
      this.currentBattle.addLog(`${this.currentBattle.enemy.name} usou ${skill.name}! Dano: ${actualDamage}`);
      this.currentBattle.defendActive = false;

      if (this.currentBattle.hero.hp <= 0) {
        this._endBattle('defeat');
        return;
      }
    }

    this.currentBattle.isPlayerTurn = true;
  }

  flee() {
    if (!this.currentBattle) return false;

    const fleeChance = 0.6;
    if (Math.random() < fleeChance) {
      this._endBattle('flee');
      this.currentBattle.addLog('Você conseguiu fugir!');
      return true;
    }

    this.currentBattle.addLog('Falha ao fugir!');
    this.currentBattle.isPlayerTurn = false;
    return false;
  }

  _executeAttack(skill) {
    const damage = Math.floor(Math.random() * (skill.damage.max - skill.damage.min + 1)) + skill.damage.min;
    const actualDamage = this.currentBattle.defendActive ? Math.floor(damage * 0.5) : damage;
    
    this.currentBattle.enemy.hp -= actualDamage;
    this.currentBattle.addLog(`${this.currentBattle.hero.name} usou ${skill.name}! Dano: ${actualDamage}`);
    this.currentBattle.defendActive = false;
  }

  _executeHeal(skill) {
    const heal = Math.floor(Math.random() * (skill.heal.max - skill.heal.min + 1)) + skill.heal.min;
    const oldHp = this.currentBattle.hero.hp;
    this.currentBattle.hero.hp = Math.min(this.currentBattle.hero.maxHp, this.currentBattle.hero.hp + heal);
    const actualHeal = this.currentBattle.hero.hp - oldHp;
    
    this.currentBattle.addLog(`${this.currentBattle.hero.name} se curou! +${actualHeal} HP`);
  }

  _executeDefense(skill) {
    this.currentBattle.defendActive = true;
    this.currentBattle.addLog(`${this.currentBattle.hero.name} se defendeu!`);
  }

  _endBattle(result) {
    this.currentBattle.battleEnded = true;
    this.currentBattle.result = result;

    if (result === 'victory') {
      const xp = this.currentBattle.enemy.xpReward;
      this.currentBattle.hero.xp += xp;
      this.currentBattle.addLog(`Vitória! +${xp} XP`);

      if (this.currentBattle.hero.xp >= this.currentBattle.hero.xpToNext) {
        this.currentBattle.hero.level++;
        this.currentBattle.hero.xp = 0;
        this.currentBattle.hero.xpToNext = Math.floor(this.currentBattle.hero.xpToNext * 1.5);
        this.currentBattle.addLog(`⬆️ LEVEL UP! Nível ${this.currentBattle.hero.level}`);
        this.currentBattle.result = 'levelUp';
      }
    } else if (result === 'defeat') {
      this.currentBattle.addLog('Você foi derrotado...');
    }
  }

  getCurrentBattle() {
    return this.currentBattle;
  }

  getSkills() {
    return Object.values(SKILLS_CONFIG);
  }

  getRandomEnemy() {
    const nonBosses = ENEMIES_DATABASE.filter(e => !e.isBoss);
    return nonBosses[Math.floor(Math.random() * nonBosses.length)];
  }
}

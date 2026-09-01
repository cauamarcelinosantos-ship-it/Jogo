/* ============================================================
 * SISTEMA DE COMBATE - VERSÃO VANILLA JS
 * ==========================================================*/

// ===== CONFIGURAÇÃO DE HABILIDADES =====
const SKILLS_CONFIG = {
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

// ===== INIMIGOS DISPONÍVEIS =====
const ENEMIES_DATABASE = [
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

// ===== ESTADO DA BATALHA =====
class BattleState {
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
        return this.log;
    }

    reset() {
        this.log = [];
        this.turn = 0;
        this.isPlayerTurn = true;
        this.battleEnded = false;
        this.result = null;
        this.defendActive = false;
    }
}

// ===== GERENCIADOR DE BATALHA =====
class BattleManager {
    constructor(hero) {
        this.hero = hero;
        this.currentBattle = null;
        this.listeners = {
            onBattleStart: [],
            onTurn: [],
            onBattleEnd: [],
            onSkillUse: [],
            onEnemyTurn: []
        };
    }

    startBattle(enemyId) {
        const enemy = ENEMIES_DATABASE.find(e => e.id === enemyId);
        if (!enemy) {
            console.error(`Inimigo ${enemyId} não encontrado`);
            return null;
        }

        this.currentBattle = new BattleState(this.hero, { ...enemy });
        this.currentBattle.addLog(`${this.hero.name} encontrou um ${enemy.name}!`);
        
        this.emit('onBattleStart', this.currentBattle);
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

        // Gastar MP
        this.currentBattle.hero.mp -= skill.cost;

        // Executar habilidade
        if (skill.damage) {
            this._executeAttack(skill);
        } else if (skill.heal) {
            this._executeHeal(skill);
        } else if (skill.defense !== undefined) {
            this._executeDefense(skill);
        }

        this.emit('onSkillUse', { skill, battle: this.currentBattle });

        // Verificar se inimigo foi derrotado
        if (this.currentBattle.enemy.hp <= 0) {
            this._endBattle('victory');
            return true;
        }

        // Turno do inimigo
        this.currentBattle.isPlayerTurn = false;
        setTimeout(() => this._enemyTurn(), 1000);

        return true;
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
        setTimeout(() => this._enemyTurn(), 1000);
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

    _enemyTurn() {
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

        this.emit('onEnemyTurn', this.currentBattle);
        this.currentBattle.isPlayerTurn = true;
        this.emit('onTurn', this.currentBattle);
    }

    _endBattle(result) {
        this.currentBattle.battleEnded = true;
        this.currentBattle.result = result;

        if (result === 'victory') {
            const xp = this.currentBattle.enemy.xpReward;
            this.currentBattle.hero.xp += xp;
            this.currentBattle.addLog(`Vitória! +${xp} XP`);

            // Verificar level up
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

        this.emit('onBattleEnd', this.currentBattle);
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
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

// ===== RENDERIZADOR DE TELA DE BATALHA (DOM) =====
class BattleScreenRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.battleManager = null;
    }

    setBattleManager(battleManager) {
        this.battleManager = battleManager;
    }

    renderBattle(battle) {
        if (!this.container) return;

        const html = `
            <div class="battle-screen">
                <div class="battle-arena">
                    <!-- HERO -->
                    <div class="battle-character hero-side">
                        <div class="character-sprite">${battle.hero.sprite}</div>
                        <div class="character-info">
                            <h3>${battle.hero.name}</h3>
                            <div class="stat-bar">
                                <div class="stat-label">HP</div>
                                <div class="stat-track">
                                    <div class="stat-fill hp-fill" style="width: ${(battle.hero.hp / battle.hero.maxHp) * 100}%"></div>
                                </div>
                                <span class="stat-value">${battle.hero.hp}/${battle.hero.maxHp}</span>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-label">MP</div>
                                <div class="stat-track">
                                    <div class="stat-fill mp-fill" style="width: ${(battle.hero.mp / battle.hero.maxMp) * 100}%"></div>
                                </div>
                                <span class="stat-value">${battle.hero.mp}/${battle.hero.maxMp}</span>
                            </div>
                        </div>
                    </div>

                    <!-- VS -->
                    <div class="battle-vs">⚔️</div>

                    <!-- ENEMY -->
                    <div class="battle-character enemy-side">
                        <div class="character-sprite">${battle.enemy.sprite}</div>
                        <div class="character-info">
                            <h3>${battle.enemy.name}</h3>
                            <div class="stat-bar">
                                <div class="stat-label">HP</div>
                                <div class="stat-track">
                                    <div class="stat-fill hp-fill" style="width: ${(battle.enemy.hp / battle.enemy.maxHp) * 100}%"></div>
                                </div>
                                <span class="stat-value">${battle.enemy.hp}/${battle.enemy.maxHp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SKILLS -->
                <div class="skills-grid">
                    ${this.battleManager.getSkills().map(skill => `
                        <button class="skill-button ${skill.cost > battle.hero.mp ? 'disabled' : ''}" 
                                ${skill.cost > battle.hero.mp ? 'disabled' : ''}
                                onclick="window.battleManager.useSkill('${skill.id}')">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-cost">${skill.cost > 0 ? skill.cost + ' MP' : 'Livre'}</div>
                        </button>
                    `).join('')}
                    <button class="skill-button flee-button" onclick="window.battleManager.flee()">
                        Fugir
                    </button>
                </div>

                <!-- LOG -->
                <div class="battle-log">
                    ${battle.log.length === 0 
                        ? '<p class="log-empty">A batalha começou...</p>'
                        : battle.log.map((entry, idx) => `<p key="${idx}">• ${entry}</p>`).join('')
                    }
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    renderResult(battle, onContinue, onRestart) {
        if (!this.container) return;

        const isDefeat = battle.result === 'defeat';
        const isLevelUp = battle.result === 'levelUp';
        
        const emoji = isDefeat ? '☠️' : isLevelUp ? '✦' : '✓';
        const title = isDefeat ? 'Derrota' : isLevelUp ? 'Nível Aumentado!' : 'Vitória';
        const message = isDefeat 
            ? `Você foi derrotado por ${battle.enemy.name}...`
            : isLevelUp
            ? `Parabéns! Você alcançou o nível ${battle.hero.level}!`
            : `Você venceu ${battle.enemy.name}!`;

        const html = `
            <div class="result-screen">
                <div class="result-emoji">${emoji}</div>
                <h2 class="result-title">${title}</h2>
                <p class="result-message">${message}</p>
                <div class="result-buttons">
                    ${isDefeat 
                        ? `<button class="btn-primary" onclick="window.battleResultHandler.restart()">Tentar de Novo</button>`
                        : `<button class="btn-primary" onclick="window.battleResultHandler.continue()">Continuar</button>`
                    }
                </div>
            </div>
        `;

        this.container.innerHTML = html;

        // Armazenar callbacks globalmente
        window.battleResultHandler = { continue: onContinue, restart: onRestart };
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BattleManager, BattleScreenRenderer, BattleState, ENEMIES_DATABASE, SKILLS_CONFIG };
}

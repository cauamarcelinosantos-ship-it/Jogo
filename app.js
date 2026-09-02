// ===== CONFIGURAÇÕES DO JOGO =====
const GAME_CONFIG = {
    normal: { maxEnergy: 12, fragmentsNeeded: 3, enemySpeed: 2 },
    hard: { maxEnergy: 8, fragmentsNeeded: 5, enemySpeed: 1 }
};

// ===== ELEMENTOS DO DOM =====
const loginPanel = document.querySelector('#login-panel');
const gamePanel = document.querySelector('#game-panel');
const logoutButton = document.querySelector('#logout-button');
const mapElement = document.querySelector('#map');
const gameMessage = document.querySelector('#game-message');
const energyValue = document.querySelector('#energy-value');
const fragmentValue = document.querySelector('#fragment-value');
const movementButtons = document.querySelectorAll('[data-move]');

// ===== VARIÁVEIS DE ESTADO =====
let gameState = null;
let isGameWon = false;
let isGameOver = false;
let gameDifficulty = 'normal';
let gameLevel = 1;
let playerScore = 0;
let powerUpActive = null;
let powerUpTimer = null;
let enemies = [];
let enemyMoveCounter = 0;

// ===== SISTEMA DE COMBATE =====
let battleManager = null;
let battleRenderer = null;
let inBattle = false;

// ===== CONFIGURAÇÃO DO MAPA =====
const mapCells = [
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '✦', type: 'fragment' },
    { icon: '⌁', type: 'water' }, { icon: '●', type: 'start' }, { icon: '⭐', type: 'powerup' },
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '◉', type: 'portal' }
];

// ===== SELETOR DE MODO DE JOGO =====
function showGameModeSelector() {
    const modeChoice = prompt('Escolha o modo de jogo:\n1 = Normal\n2 = Difícil', '1');
    gameDifficulty = modeChoice === '2' ? 'hard' : 'normal';
    gameLevel = 1;
    playerScore = 0;
    startNewGame();
}

// ===== INICIALIZAÇÃO DO JOGO =====
function getGameState(email) {
    try {
        const saved = JSON.parse(localStorage.getItem(`jogo-progress-${email}`) || 'null');
        if (saved && Number.isInteger(saved.position) && Number.isInteger(saved.energy) && Array.isArray(saved.fragments)) {
            return saved;
        }
    } catch (error) {
        console.warn('Progresso inválido; uma nova aventura será iniciada.', error);
    }
    const config = GAME_CONFIG[gameDifficulty];
    return { position: 4, energy: config.maxEnergy, fragments: [] };
}

function saveGameState() {
    localStorage.setItem(`jogo-progress-${gameState.email}`, JSON.stringify(gameState));
}

function startNewGame() {
    const config = GAME_CONFIG[gameDifficulty];
    gameState = {
        email: 'player',
        position: 4,
        energy: config.maxEnergy,
        fragments: [],
        level: gameLevel,
        // Hero stats
        name: 'Herói',
        maxHp: 100,
        hp: 100,
        maxMp: 50,
        mp: 50,
        sprite: '⚔️',
        xp: 0,
        xpToNext: 100
    };

    enemies = generateEnemies();
    powerUpActive = null;
    isGameWon = false;
    isGameOver = false;
    inBattle = false;
    enemyMoveCounter = 0;

    // Inicializar sistema de combate
    if (!battleManager) {
        battleManager = new BattleManager(gameState);
        battleRenderer = new BattleScreenRenderer('battle-container');
        battleRenderer.setBattleManager(battleManager);

        // Listeners do sistema de combate
        battleManager.on('onBattleStart', () => {
            const battleContainer = document.getElementById('battle-container');
            const mapContainer = document.getElementById('map');
            if (battleContainer && mapContainer) {
                mapContainer.parentElement.parentElement.style.display = 'none';
                battleContainer.style.display = 'block';
            }
        });

        battleManager.on('onTurn', (battle) => {
            battleRenderer.renderBattle(battle);
        });

        battleManager.on('onBattleEnd', (battle) => {
            if (battle.result === 'victory' || battle.result === 'levelUp') {
                battleRenderer.renderResult(battle, () => {
                    endBattle('victory');
                }, () => {
                    // Restart não aplicável em vitória
                });
            } else if (battle.result === 'defeat') {
                battleRenderer.renderResult(battle, () => {
                    // Continue não aplicável em derrota
                }, () => {
                    endBattle('defeat');
                });
            } else if (battle.result === 'flee') {
                endBattle('flee');
            }
        });

        // Expor globalmente para onclick
        window.battleManager = battleManager;
    } else {
        battleManager.hero = gameState;
    }

    renderGame();
    updateScore();
}

// ===== GERAÇÃO DE INIMIGOS =====
function generateEnemies() {
    const config = GAME_CONFIG[gameDifficulty];
    const count = Math.min(1 + gameLevel, 4);
    const enemies = [];
    const forbidden = [4, 8]; // start e portal

    for (let i = 0; i < count; i++) {
        let pos;
        do {
            pos = Math.floor(Math.random() * 9);
        } while (forbidden.includes(pos) || enemies.some(e => e.pos === pos));

        enemies.push({ pos, moveInterval: config.enemySpeed });
    }
    return enemies;
}

// ===== MOVIMENTO DE INIMIGOS =====
function moveEnemies() {
    if (enemyMoveCounter++ % 2 !== 0) return; // Reduz velocidade

    enemies.forEach(enemy => {
        const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const row = Math.floor(enemy.pos / 3);
        const col = enemy.pos % 3;

        let moved = false;
        while (!moved) {
            const [dr, dc] = moves[Math.floor(Math.random() * moves.length)];
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                enemy.pos = newRow * 3 + newCol;
                moved = true;
            }
        }

        // Inimigo capturou o jogador
        if (enemy.pos === gameState.position) {
            isGameOver = true;
            gameMessage.textContent = '💥 Você foi capturado! Fim de jogo.';
        }
    });
}

// ===== SISTEMA DE PODER-UP =====
function activatePowerUp() {
    powerUpActive = 'shield';
    gameMessage.textContent = '✨ Escudo ativado! (10 segundos)';
    playerScore += 50;

    if (powerUpTimer) clearTimeout(powerUpTimer);
    powerUpTimer = setTimeout(() => {
        powerUpActive = null;
        gameMessage.textContent = 'Escudo expirou.';
    }, 10000);
}

// ===== RENDERIZAÇÃO DO JOGO =====
function renderGame() {
    mapElement.innerHTML = '';

    mapCells.forEach((cell, index) => {
        const tile = document.createElement('div');
        tile.className = `map-tile ${cell.type}`;

        const isPlayer = gameState.position === index;
        const hasEnemy = enemies.some(e => e.pos === index);

        if (isPlayer) tile.classList.add('player');
        if (hasEnemy) tile.classList.add('enemy');
        if (cell.type === 'fragment' && gameState.fragments.includes(index)) tile.classList.add('collected');

        if (isPlayer) {
            const shield = powerUpActive ? '🛡️' : '';
            tile.innerHTML = `<span class="character" aria-hidden="true"><span class="character-hair"></span><span class="character-face">•</span><span class="character-body"></span></span><span style="position:absolute;top:-15px;font-size:20px;">${shield}</span>`;
        } else if (hasEnemy) {
            tile.innerHTML = '<span class="scene-object" aria-hidden="true">👾</span>';
        } else {
            const icon = cell.type === 'fragment' && gameState.fragments.includes(index) ? '·' : cell.icon;
            tile.innerHTML = `<span class="scene-object" aria-hidden="true">${icon}</span>`;
        }

        tile.setAttribute('aria-label', isPlayer ? 'Seu personagem está aqui' : `Casa ${index + 1}`);
        mapElement.appendChild(tile);
    });

    energyValue.textContent = gameState.energy;
    const config = GAME_CONFIG[gameDifficulty];
    fragmentValue.textContent = `${gameState.fragments.length}/${config.fragmentsNeeded}`;
}

// ===== MOVIMENTO DO JOGADOR =====
function movePlayer(direction) {
    if (!gameState || gameState.energy <= 0 || isGameWon || isGameOver || inBattle) return;

    const row = Math.floor(gameState.position / 3);
    const column = gameState.position % 3;
    const moves = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

    if (!moves[direction]) return;

    const [rowChange, columnChange] = moves[direction];
    const nextRow = row + rowChange;
    const nextColumn = column + columnChange;

    if (nextRow < 0 || nextRow > 2 || nextColumn < 0 || nextColumn > 2) {
        gameMessage.textContent = 'A montanha bloqueia esse caminho.';
        return;
    }

    gameState.position = nextRow * 3 + nextColumn;
    gameState.energy -= 1;

    // Verificar inimigo
    const enemyAtPosition = enemies.find(e => e.pos === gameState.position);
    if (enemyAtPosition) {
        // Iniciar combate
        startBattle(enemyAtPosition);
        renderGame();
        return;
    }

    // Remover escudo se colidiu com inimigo
    if (powerUpActive && enemies.some(e => e.pos === gameState.position)) {
        powerUpActive = null;
        gameMessage.textContent = 'Escudo quebrado! Cuidado!';
        playerScore += 100;
    }

    const cell = mapCells[gameState.position];
    const config = GAME_CONFIG[gameDifficulty];

    if (cell.type === 'fragment' && !gameState.fragments.includes(gameState.position)) {
        gameState.fragments.push(gameState.position);
        playerScore += 100;
        gameMessage.textContent = 'Você encontrou um fragmento de Aurora!';
    } else if (cell.type === 'powerup' && !powerUpActive) {
        activatePowerUp();
    } else if (cell.type === 'portal' && gameState.fragments.length < config.fragmentsNeeded) {
        gameMessage.textContent = `O portal está adormecido. Faltam ${config.fragmentsNeeded - gameState.fragments.length} fragmentos.`;
    } else if (gameState.fragments.length === config.fragmentsNeeded && cell.type === 'portal') {
        completeLevel();
    } else if (gameState.energy === 0) {
        isGameOver = true;
        gameMessage.textContent = 'Sua energia acabou. Fim de jogo.';
    } else {
        gameMessage.textContent = 'A trilha segue silenciosa. Continue explorando.';
    }

    moveEnemies();
    saveGameState();
    renderGame();
}

// ===== SISTEMA DE COMBATE =====
function startBattle(enemy) {
    if (!battleManager) return;

    console.log('⚔️ Iniciando combate...');
    inBattle = true;
    const enemyType = Object.keys(ENEMIES_DATABASE).find(key =>
        ENEMIES_DATABASE[key].sprite === '👾' || Math.random() > 0.5
    );

    // Selecionar inimigo aleatório
    const selectedEnemyId = ENEMIES_DATABASE[Math.floor(Math.random() * ENEMIES_DATABASE.length)].id;
    const battle = battleManager.startBattle(selectedEnemyId);

    if (battle) {
        battleRenderer.renderBattle(battle);

        // Usar UIManager para mostrar tela de combate
        if (typeof uiManager !== 'undefined') {
            const battleHTML = document.querySelector('#battle-container').innerHTML;
            uiManager.showBattleScreen(battleHTML);
        }
    }
}

function endBattle(result) {
    console.log('🎮 Finalizando combate com resultado:', result);
    inBattle = false;
    const battleContainer = document.getElementById('battle-container');
    const mapContainer = document.getElementById('map');

    if (battleContainer && mapContainer) {
        battleContainer.style.display = 'none';
        mapContainer.parentElement.parentElement.style.display = 'grid';

        // Usar UIManager para voltar à tela de gameplay
        if (typeof uiManager !== 'undefined') {
            uiManager.showGameScreenAfterBattle();
        }
    }

    if (result === 'victory') {
        playerScore += 200;
        gameMessage.textContent = '🎉 Você venceu a batalha!';

        // Remover inimigo do mapa
        const currentEnemy = enemies.find(e => e.pos === gameState.position);
        if (currentEnemy) {
            enemies = enemies.filter(e => e !== currentEnemy);
        }
    } else if (result === 'defeat') {
        isGameOver = true;
        gameMessage.textContent = '💥 Você foi derrotado na batalha!';
    } else if (result === 'flee') {
        gameMessage.textContent = 'Você fugiu da batalha!';
        // Mover para posição anterior
        gameState.position = 4;
    }

    renderGame();
}

// ===== COMPLETAR NÍVEL =====
function completeLevel() {
    playerScore += 500 + (gameLevel * 100);
    gameMessage.textContent = `🎉 Nível ${gameLevel} concluído! Próximo nível...`;
    gameLevel++;

    setTimeout(() => {
        if (gameLevel <= 3) {
            startNewGame();
        } else {
            winGame();
        }
    }, 2000);
}

// ===== VITÓRIA FINAL =====
function winGame() {
    isGameWon = true;
    playerScore += 1000;
    gameMessage.textContent = '🏆 Você venceu a aventura completa! Parabéns!';
    console.log(`Pontuação final: ${playerScore}`);
}

// ===== ATUALIZAR PONTUAÇÃO =====
function updateScore() {
    const scoreDisplay = document.querySelector('#score-value');
    if (scoreDisplay) scoreDisplay.textContent = playerScore;
}

// ===== INICIAR JOGO DIRETO =====
function initGame() {
    loginPanel.hidden = true;
    gamePanel.hidden = false;
    showGameModeSelector();
}

// ===== EVENT LISTENERS - MOVIMENTO =====
movementButtons.forEach((button) => {
    button.addEventListener('click', () => movePlayer(button.dataset.move));
});

document.addEventListener('keydown', (event) => {
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key] && !gamePanel.hidden) {
        event.preventDefault();
        movePlayer(directions[event.key]);
    }
});

logoutButton.addEventListener('click', () => {
    if (confirm('Deseja realmente sair e voltar ao menu?')) {
        location.reload();
    }
});

// ===== INICIAR JOGO QUANDO PÁGINA CARREGA =====
window.addEventListener('load', () => {
    initGame();
});
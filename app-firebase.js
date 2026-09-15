// ===== CONFIGURAÇÕES DO JOGO =====
const GAME_CONFIG = {
    normal: { maxEnergy: 12, fragmentsNeeded: 3, enemySpeed: 2 },
    hard: { maxEnergy: 8, fragmentsNeeded: 5, enemySpeed: 1 }
};

// ===== CONFIGURAÇÃO DO MAPA =====
const mapCells = [
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '✦', type: 'fragment' },
    { icon: '⌁', type: 'water' },    { icon: '●', type: 'start' },    { icon: '⭐', type: 'powerup' },
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '◉', type: 'portal' }
];

// ===== ELEMENTOS DO DOM =====
const loginPanel = document.querySelector('#login-panel');
const gamePanel = document.querySelector('#game-panel');
const googleLoginBtn = document.querySelector('#google-login-btn');
const anonymousLoginBtn = document.querySelector('#anonymous-login-btn');
const formMessage = document.querySelector('#form-message');
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
let currentUser = null;
let db = null;
let auth = null;

// ===== COMPONENTE DE INTERFACE (FALLBACK) =====
const UI = {
    showMessage(text, isSuccess = false) {
        if (typeof uiManager !== 'undefined' && uiManager?.showFormMessage) {
            uiManager.showFormMessage(text, isSuccess);
        } else if (formMessage) {
            formMessage.textContent = text;
            formMessage.style.color = isSuccess ? '#2ecc71' : '#e74c3c';
        } else {
            console.log(`[UI]: ${text}`);
        }
    },
    showLogin() {
        if (typeof uiManager !== 'undefined' && uiManager?.showLoginScreen) {
            uiManager.showLoginScreen();
        } else if (loginPanel && gamePanel) {
            loginPanel.hidden = false;
            gamePanel.hidden = true;
        }
    },
    showGame(playerName) {
        if (typeof uiManager !== 'undefined' && uiManager?.showGameScreen) {
            uiManager.showGameScreen(playerName);
        } else if (loginPanel && gamePanel) {
            loginPanel.hidden = true;
            gamePanel.hidden = false;
        }
    }
};

// ===== INICIALIZAÇÃO DO FIREBASE =====
async function initFirebase() {
    try {
        const firebaseConfig = {
            apiKey: "AIzaSyARdKWyJt_wMbCDtaHHq7rd3IUOiU_-jLM",
            authDomain: "jogo-rpg-9397e.firebaseapp.com",
            projectId: "jogo-rpg-9397e",
            storageBucket: "jogo-rpg-9397e.firebasestorage.app",
            messagingSenderId: "766202144087",
            appId: "1:766202144087:web:b1ff8d02f99bbaa4174a12",
            measurementId: "G-TK52NLJ4VN"
        };

        const isPlaceholder = firebaseConfig.apiKey.includes('DEMO') ||
                              firebaseConfig.authDomain.includes('seu-projeto') ||
                              firebaseConfig.projectId === 'seu-projeto';

        if (isPlaceholder) {
            console.warn('⚠️ Firebase não configurado. Modo OFFLINE ativo.');
            setOfflineMode();
            return;
        }

        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
        const { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                UI.showMessage(`Bem-vindo, ${user.displayName || 'Jogador'}!`, true);
                setTimeout(() => startGameFlow(), 1000);
            } else {
                currentUser = null;
                UI.showLogin();
            }
        });

        // Listeners de Autenticação
        googleLoginBtn?.addEventListener('click', async () => {
            googleLoginBtn.disabled = true;
            try {
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error('❌ Erro no login Google:', error);
                UI.showMessage(getAuthErrorMessage(error));
                googleLoginBtn.disabled = false;
            }
        });

        anonymousLoginBtn?.addEventListener('click', async () => {
            anonymousLoginBtn.disabled = true;
            try {
                await signInAnonymously(auth);
            } catch (error) {
                console.error('❌ Erro no login anônimo:', error);
                UI.showMessage('Erro ao conectar de forma anônima.');
                anonymousLoginBtn.disabled = false;
            }
        });

        logoutButton?.addEventListener('click', async () => {
            if (confirm('Deseja sair e voltar ao menu principal?')) {
                await signOut(auth);
            }
        });

    } catch (error) {
        console.error('❌ Erro na inicialização do Firebase:', error);
        setOfflineMode();
    }
}

function setOfflineMode() {
    currentUser = { uid: `offline-${Date.now()}`, displayName: 'Jogador Local' };
    db = null;
    UI.showMessage('📱 Modo Offline - Progresso salvo localmente');
    setTimeout(() => startGameFlow(), 800);
}

function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/popup-blocked': return 'Pop-up bloqueado pelo navegador.';
        case 'auth/unauthorized-domain': return 'Domínio não autorizado no Firebase Console.';
        case 'auth/operation-not-allowed': return 'Provedor de login não ativado.';
        case 'auth/invalid-api-key': return 'Chave de API do Firebase inválida.';
        default: return `Erro de conexão: ${error.message}`;
    }
}

// ===== FLUXO E ESTADO DO JOGO =====
function startGameFlow() {
    const playerName = currentUser?.displayName || 'Jogador Anônimo';
    UI.showGame(playerName);
    showGameModeSelector();
}

function showGameModeSelector() {
    const modeChoice = prompt('Escolha o modo de jogo:\n1 = Normal\n2 = Difícil', '1');
    gameDifficulty = modeChoice === '2' ? 'hard' : 'normal';
    gameLevel = 1;
    playerScore = 0;
    startNewGame();
}

function startNewGame() {
    const config = GAME_CONFIG[gameDifficulty];
    gameState = {
        position: 4,
        energy: config.maxEnergy,
        fragments: [],
        level: gameLevel
    };
    enemies = generateEnemies();
    powerUpActive = null;
    isGameWon = false;
    isGameOver = false;
    enemyMoveCounter = 0;
    renderGame();
    updateScore();
}

function saveGameState() {
    const key = `jogo-progress-${currentUser?.uid || 'offline'}`;
    localStorage.setItem(key, JSON.stringify(gameState));
}

async function salvarPontuacao(nome, pontos) {
    if (!db || !currentUser) return;

    try {
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        await addDoc(collection(db, 'placares'), {
            userId: currentUser.uid,
            nome: nome || currentUser.displayName || 'Anônimo',
            pontos: pontos,
            dificuldade: gameDifficulty,
            nivel: gameLevel,
            data: serverTimestamp()
        });
        console.log(`✅ Pontuação de ${pontos} salva no Firestore!`);
    } catch (error) {
        console.error('❌ Erro ao salvar pontuação:', error);
    }
}

// ===== INIMIGOS E PODERES =====
function generateEnemies() {
    const config = GAME_CONFIG[gameDifficulty];
    const count = Math.min(1 + gameLevel, 4);
    const generated = [];
    const forbidden = [4, 8];

    while (generated.length < count) {
        const pos = Math.floor(Math.random() * 9);
        if (!forbidden.includes(pos) && !generated.some(e => e.pos === pos)) {
            generated.push({ pos, moveInterval: config.enemySpeed });
        }
    }
    return generated;
}

function moveEnemies() {
    if (enemyMoveCounter++ % 2 !== 0) return;

    enemies.forEach(enemy => {
        const moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const row = Math.floor(enemy.pos / 3);
        const col = enemy.pos % 3;

        let moved = false;
        let attempts = 0;
        while (!moved && attempts < 10) {
            attempts++;
            const [dr, dc] = moves[Math.floor(Math.random() * moves.length)];
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                enemy.pos = newRow * 3 + newCol;
                moved = true;
            }
        }

        if (enemy.pos === gameState.position && !powerUpActive) {
            isGameOver = true;
            if (gameMessage) gameMessage.textContent = '💥 Você foi capturado! Fim de jogo.';
        }
    });
}

function activatePowerUp() {
    powerUpActive = 'shield';
    if (gameMessage) gameMessage.textContent = '✨ Escudo ativado! (10 segundos)';
    playerScore += 50;

    if (powerUpTimer) clearTimeout(powerUpTimer);
    powerUpTimer = setTimeout(() => {
        powerUpActive = null;
        if (gameMessage) gameMessage.textContent = 'Escudo expirou.';
        renderGame();
    }, 10000);
}

// ===== MOVIMENTAÇÃO E REGRAS DO JOGADOR =====
function movePlayer(direction) {
    if (!gameState || gameState.energy <= 0 || isGameWon || isGameOver) return;

    const row = Math.floor(gameState.position / 3);
    const col = gameState.position % 3;
    const moves = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

    if (!moves[direction]) return;

    const [dr, dc] = moves[direction];
    const nextRow = row + dr;
    const nextCol = col + dc;

    if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2) {
        if (gameMessage) gameMessage.textContent = 'A montanha bloqueia esse caminho.';
        return;
    }

    gameState.position = nextRow * 3 + nextCol;
    gameState.energy -= 1;

    // Colisão com Inimigos
    if (enemies.some(e => e.pos === gameState.position)) {
        if (powerUpActive) {
            powerUpActive = null;
            playerScore += 100;
            if (gameMessage) gameMessage.textContent = '🛡️ Escudo absorveu o impacto!';
        } else {
            isGameOver = true;
            if (gameMessage) gameMessage.textContent = '💥 Você foi capturado! Fim de jogo.';
            renderGame();
            return;
        }
    }

    // Interações com Celulas
    const cell = mapCells[gameState.position];
    const config = GAME_CONFIG[gameDifficulty];

    if (cell.type === 'fragment' && !gameState.fragments.includes(gameState.position)) {
        gameState.fragments.push(gameState.position);
        playerScore += 100;
        if (gameMessage) gameMessage.textContent = '✦ Você encontrou um fragmento!';
    } else if (cell.type === 'powerup' && !powerUpActive) {
        activatePowerUp();
    } else if (cell.type === 'portal') {
        if (gameState.fragments.length < config.fragmentsNeeded) {
            const faltam = config.fragmentsNeeded - gameState.fragments.length;
            if (gameMessage) gameMessage.textContent = `O portal exige mais ${faltam} fragmento(s).`;
        } else {
            completeLevel();
            return;
        }
    } else if (gameState.energy === 0) {
        isGameOver = true;
        if (gameMessage) gameMessage.textContent = 'Sua energia acabou. Fim de jogo.';
    } else {
        if (gameMessage) gameMessage.textContent = 'A trilha segue silenciosa...';
    }

    moveEnemies();
    saveGameState();
    renderGame();
}

function completeLevel() {
    playerScore += 500 + (gameLevel * 100);
    if (gameMessage) gameMessage.textContent = `🎉 Nível ${gameLevel} concluído!`;
    gameLevel++;

    setTimeout(() => {
        if (gameLevel <= 3) {
            startNewGame();
        } else {
            winGame();
        }
    }, 1800);
}

function winGame() {
    isGameWon = true;
    playerScore += 1000;
    if (gameMessage) gameMessage.textContent = '🏆 Você venceu a aventura completa!';
    salvarPontuacao(currentUser?.displayName, playerScore);
    updateScore();
}

// ===== RENDERIZAÇÃO E UI =====
function renderGame() {
    if (!mapElement) return;
    mapElement.innerHTML = '';

    mapCells.forEach((cell, index) => {
        const tile = document.createElement('div');
        tile.className = `map-tile ${cell.type}`;

        const isPlayer = gameState.position === index;
        const hasEnemy = enemies.some(e => e.pos === index);
        const isCollected = cell.type === 'fragment' && gameState.fragments.includes(index);

        if (isPlayer) tile.classList.add('player');
        if (hasEnemy) tile.classList.add('enemy');
        if (isCollected) tile.classList.add('collected');

        if (isPlayer) {
            const shield = powerUpActive ? '🛡️' : '';
            tile.innerHTML = `<span class="character" aria-hidden="true"><span class="character-face">🧙‍♂️</span></span><span style="position:absolute;top:-15px;">${shield}</span>`;
        } else if (hasEnemy) {
            tile.innerHTML = '<span class="scene-object" aria-hidden="true">👾</span>';
        } else {
            const icon = isCollected ? '·' : cell.icon;
            tile.innerHTML = `<span class="scene-object" aria-hidden="true">${icon}</span>`;
        }

        mapElement.appendChild(tile);
    });

    const config = GAME_CONFIG[gameDifficulty];
    if (energyValue) energyValue.textContent = gameState.energy;
    if (fragmentValue) fragmentValue.textContent = `${gameState.fragments.length}/${config.fragmentsNeeded}`;
    updateScore();
}

function updateScore() {
    const scoreDisplay = document.querySelector('#score-value');
    if (scoreDisplay) scoreDisplay.textContent = playerScore;
}

// ===== CONTROLES E EVENTOS =====
movementButtons.forEach((button) => {
    button.addEventListener('click', () => movePlayer(button.dataset.move));
});

document.addEventListener('keydown', (event) => {
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key] && gamePanel && !gamePanel.hidden) {
        event.preventDefault();
        movePlayer(directions[event.key]);
    }
});

// Inicializador da aplicação ao carregar a página
window.addEventListener('load', () => {
    initFirebase();
});
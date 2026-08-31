// ===== CONFIGURAÇÕES DO JOGO =====
const GAME_CONFIG = {
    normal: { maxEnergy: 12, fragmentsNeeded: 3, enemySpeed: 2 },
    hard: { maxEnergy: 8, fragmentsNeeded: 5, enemySpeed: 1 }
};

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

// ===== CONFIGURAÇÃO DO MAPA =====
const mapCells = [
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '✦', type: 'fragment' },
    { icon: '⌁', type: 'water' }, { icon: '●', type: 'start' }, { icon: '⭐', type: 'powerup' },
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '◉', type: 'portal' }
];

// ===== INICIALIZAR FIREBASE =====
async function initFirebase() {
    try {
        // Configuração do Firebase com suas credenciais
        const firebaseConfig = {
            apiKey: "AIzaSyARdKWyJt_wMbCDtaHHq7rd3IUOiU_-jLM",
            authDomain: "jogo-rpg-9397e.firebaseapp.com",
            projectId: "jogo-rpg-9397e",
            storageBucket: "jogo-rpg-9397e.firebasestorage.app",
            messagingSenderId: "766202144087",
            appId: "1:766202144087:web:b1ff8d02f99bbaa4174a12",
            measurementId: "G-TK52NLJ4VN"
        };

        // Detectar se credenciais são placeholder
        const isPlaceholder = firebaseConfig.apiKey.includes('DEMO') || 
                            firebaseConfig.authDomain.includes('seu-projeto') ||
                            firebaseConfig.projectId === 'seu-projeto';

        if (isPlaceholder) {
            console.warn('⚠️ Firebase não configurado. Usando modo OFFLINE.');
            currentUser = { uid: 'offline-' + Date.now(), displayName: 'Jogador Local' };
            db = null;
            formMessage.textContent = '📱 Modo Offline - Progresso salvo localmente';
            setTimeout(() => startGameFlow(), 500);
            return;
        }

        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getAuth, signInWithPopup, GoogleAuthProvider, signInAnonymously, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        db = getFirestore(app);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                currentUser = user;
                showMessage(`Bem-vindo, ${user.displayName || 'Jogador'}!`, true);
                setTimeout(() => startGameFlow(), 1000);
            } else {
                currentUser = null;
                showLogin();
            }
        });

        googleLoginBtn.addEventListener('click', async () => {
            googleLoginBtn.disabled = true;
            try {
                console.log('🔐 Iniciando login com Google...');
                const provider = new GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                const result = await signInWithPopup(auth, provider);
                console.log('✅ Login Google bem-sucedido!', result.user);
            } catch (error) {
                console.error('❌ Erro ao fazer login com Google:', error);
                console.error('Código do erro:', error.code);
                console.error('Mensagem:', error.message);
                
                let mensagem = 'Erro ao conectar com Google. ';
                
                if (error.code === 'auth/popup-blocked') {
                    mensagem += 'Pop-up foi bloqueado. Permita pop-ups para este site.';
                } else if (error.code === 'auth/unauthorized-domain') {
                    mensagem += 'Domínio não autorizado. Configure em Firebase Console > Auth > Settings';
                } else if (error.code === 'auth/operation-not-allowed') {
                    mensagem += 'Google não está habilitado em Firebase Console.';
                } else if (error.code === 'auth/invalid-api-key') {
                    mensagem += 'Credenciais Firebase inválidas. Verifique apiKey.';
                } else {
                    mensagem += error.message;
                }
                
                showMessage(mensagem);
                googleLoginBtn.disabled = false;
            }
        });

        anonymousLoginBtn.addEventListener('click', async () => {
            anonymousLoginBtn.disabled = true;
            try {
                await signInAnonymously(auth);
            } catch (error) {
                console.error('Erro ao fazer login anônimo:', error);
                showMessage('Erro ao conectar. Tente novamente.');
                anonymousLoginBtn.disabled = false;
            }
        });

        logoutButton.addEventListener('click', async () => {
            if (confirm('Deseja sair e voltar ao login?')) {
                await signOut(auth);
            }
        });

    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
        currentUser = { uid: 'offline-' + Date.now(), displayName: 'Jogador Local' };
        db = null;
        showMessage('🔌 Modo Offline - Jogo sem conexão com servidor');
        setTimeout(() => startGameFlow(), 1000);
    }
}

// ===== FUNÇÕES DE MENSAGEM =====
function showMessage(text, isSuccess = false) {
    formMessage.textContent = text;
    formMessage.classList.toggle('success', isSuccess);
}

function showLogin() {
    loginPanel.hidden = false;
    gamePanel.hidden = true;
}

// ===== INICIAR FLUXO DE JOGO =====
function startGameFlow() {
    loginPanel.hidden = true;
    gamePanel.hidden = false;
    showGameModeSelector();
}

// ===== SELETOR DE MODO DE JOGO =====
function showGameModeSelector() {
    const modeChoice = prompt('Escolha o modo de jogo:\n1 = Normal\n2 = Difícil', '1');
    gameDifficulty = modeChoice === '2' ? 'hard' : 'normal';
    gameLevel = 1;
    playerScore = 0;
    startNewGame();
}

// ===== INICIALIZAÇÃO DO JOGO =====
function getGameState() {
    try {
        const key = `jogo-progress-${currentUser?.uid || 'offline'}`;
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
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
    const key = `jogo-progress-${currentUser?.uid || 'offline'}`;
    localStorage.setItem(key, JSON.stringify(gameState));
}

async function saveScoreToFirestore() {
    if (!db || !currentUser) return;
    
    try {
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        
        const scoresRef = collection(db, 'scores');
        await addDoc(scoresRef, {
            userId: currentUser.uid,
            userName: currentUser.displayName || 'Anônimo',
            score: playerScore,
            difficulty: gameDifficulty,
            level: gameLevel,
            timestamp: serverTimestamp()
        });

        console.log(`✓ Pontuação ${playerScore} salva no Firebase!`);
    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
    }
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

// ===== GERAÇÃO DE INIMIGOS =====
function generateEnemies() {
    const config = GAME_CONFIG[gameDifficulty];
    const count = Math.min(1 + gameLevel, 4);
    const enemies = [];
    const forbidden = [4, 8];
    
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
    if (enemyMoveCounter++ % 2 !== 0) return;
    
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
    if (!gameState || gameState.energy <= 0 || isGameWon || isGameOver) return;
    
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
    
    if (!powerUpActive && enemies.some(e => e.pos === gameState.position)) {
        isGameOver = true;
        gameMessage.textContent = '💥 Você foi capturado! Fim de jogo.';
        renderGame();
        return;
    }
    
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
    saveScoreToFirestore();
    updateScore();
}

// ===== ATUALIZAR PONTUAÇÃO =====
function updateScore() {
    const scoreDisplay = document.querySelector('#score-value');
    if (scoreDisplay) scoreDisplay.textContent = playerScore;
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

// ===== INICIAR FIREBASE NA CARGA DA PÁGINA =====
window.addEventListener('load', () => {
    initFirebase();
});
